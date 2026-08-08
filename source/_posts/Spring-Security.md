---
title: "Spring Security"
date: 2025-05-09 22:56:56
updated: 2025-05-09 22:56:56
categories:
  - 笔记

cover: /img_posts/image-20250509223706686.png
---

# Spring Security

## 一、用户认证流程（Authentication）

### 流程步骤：

1. **用户提交登录请求**
    用户通过表单提交用户名和密码，发起登录请求。
2. **请求交给 `UsernamePasswordAuthenticationFilter` 过滤器处理**
    Spring Security 默认会通过 `UsernamePasswordAuthenticationFilter` 来处理基于用户名和密码的认证。
3. **获取用户名和密码，生成 `AuthenticationToken`**
    `UsernamePasswordAuthenticationFilter` 从请求中提取用户名和密码，创建一个 `UsernamePasswordAuthenticationToken` 对象。
4. **交给 `AuthenticationManager` 进行认证**
    创建的 `AuthenticationToken` 会被传递给 `AuthenticationManager`，由其进一步处理认证过程。
5. **通过 `UserDetailsService` 获取用户信息，校验密码**
    `AuthenticationManager` 会使用 `UserDetailsService` 来加载用户的详细信息，然后使用 `PasswordEncoder` 对比输入的密码与存储的密码是否匹配。
6. **认证成功或失败处理**
   - 如果密码正确，`AuthenticationManager` 会生成一个认证成功的 `Authentication` 对象。
   - 如果密码不正确，`AuthenticationManager` 会抛出 `AuthenticationException` 异常。
7. **成功认证处理**
    `UsernamePasswordAuthenticationFilter` 将认证成功的 `Authentication` 对象交给 `SecurityContextHolder` 进行管理。接着，`AuthenticationSuccessHandler` 会被调用来处理认证成功的后续操作。
8. **失败认证处理**
    如果认证失败，`UsernamePasswordAuthenticationFilter` 会调用 `AuthenticationFailureHandler` 来处理认证失败的情况，例如返回错误消息或重定向到登录页面。

### 流程图

![image-20250509223706686](/img_posts/image-20250509223706686.png)


### 相关类和接口：

| 角色           | 类 / 接口                   | 你项目中的实现             |
| -------------- | --------------------------- | -------------------------- |
| 用户信息服务   | `UserDetailsService`        | `UserDetailsServiceImpl`   |
| 用户信息模型   | `UserDetails`               | Spring 提供的 `User`       |
| 身份验证管理器 | `AuthenticationManager`     | 自定义 `@Bean` 配置        |
| 提供者         | `DaoAuthenticationProvider` | 在 `SecurityConfig` 中配置 |

##相关配置

**SecurityConfig配置**

```java
package com.ch.personmis.security;

import org.apache.tomcat.util.security.MD5Encoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.web.SecurityFilterChain;

import javax.annotation.Resource;

@Configuration
public class SecurityConfig {
    @Resource
    private UserDetailsService userDetailsServiceImpl;
    @Resource
    private MyAuthenticationSuccessHandler myAuthenticationSuccessHandler;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable() // 关闭csrf防护
                .authorizeHttpRequests(authorize -> authorize
                        .antMatchers("/login").permitAll()  // 放行所有访问者
                        .antMatchers("/getDepartment/**").hasRole("user") //指定权限，security会在user前加上‘ROLE_'
                        .anyRequest().authenticated() 
                )
                .cors(Customizer.withDefaults()) // 启用默认 CORS 配置 //主要放行option预检请求，否则会报跨域错误
                .headers(HeadersConfigurer::cacheControl)
                .formLogin()  // 不指定loginpage
                .loginProcessingUrl("/login")// 指定前端post登录请求提交地址，不接受json的数据，默认接受表单格式数据
                .usernameParameter("uname")  // 对应 input 的 name
                .passwordParameter("upwd")
                // defaultSuccessUrl() 不能返回 JSON，只会触发一次 HTTP 302 重定向，不会调用你自定义的控制器接口返回数据 ,也就是让游览器location重定向路径
                //.defaultSuccessUrl("/sucLogin"); //登录成功后跳转的页面;
                .successHandler(myAuthenticationSuccessHandler); //登录成功处理
        return httpSecurity.build();
    }
      @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsServiceImpl);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authenticationProvider);
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
```

**前端请求配置**

```
this.$axios.post('/login', qs.stringify({
  uname: loginForm.uname,
  upwd: loginForm.upwd
}), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded', // 指定数据为表单格式
  }
})
```

**UserDetailsServiceImpl实现UserDetailsService，重写loadUserByUsername()方法**

```

package com.ch.personmis.security;

import com.ch.personmis.entity.UserEntity;
import com.ch.personmis.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private AdminRepository adminMapper;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(username);
        // 从数据库中获取用户信息
        UserEntity us=adminMapper.selectUserByName(username);
        String[] roles=us.getRoles().split(";");
        List<GrantedAuthority> authorizes = new ArrayList<>();
        for(String role:roles){
            System.out.println(role);
            authorizes.add(new SimpleGrantedAuthority("ROLE_"+role));
        }
       // 明文加密
        //User user=new User(us.getUname(),"{noop}"+us.getUpwd(),authorizes);
        //密文加密
        User user=new User(us.getUname(),us.getUpwd(),authorizes);
        return user;
   }
}
```

**登录成功处理**

```
package com.ch.personmis.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * 登录成功处理
 */
@Component
public class MyAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("\"ok\"");
    }
}
```

**登录失败处理**

```java
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        // 例如：设置错误消息到请求属性
        request.setAttribute("error", "Invalid username or password");

        // 重定向到登录页面并带上错误参数
        response.sendRedirect("/login?error");
        ......................
    }
}

```

**设置请求携带cookie**

```js
const axios = require('axios')//使用 axios 来完成 ajax 请求。
// 设置全局请求默认携带 cookie
axios.defaults.withCredentials = true
```

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * 跨域处理
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // 覆盖所有请求
        registry.addMapping("/**")
                // 允许发送 Cookie  
                .allowCredentials(true)
            ...............
    }
}
```

**security认证用户默认工作原理：**

1. 用户登录时，Spring Security 会创建一个 `SecurityContext` 对象，其中保存了用户认证信息（例如用户名、角色等）。
2. `SecurityContext` 会存储在 **HTTP Session** 中。
3. Spring Security 会在每次请求时检查 Session 中的 `SecurityContext`，如果存在且有效，用户就被认为已认证。
      1. **security默认保存用户信息**
      2. Spring Security 会生成一个 Session ID 并在浏览器中存储一个 **Session Cookie**（例如 `JSESSIONID`）。
      3. 在每个请求中，客户端都会携带这个 `JSESSIONID` Cookie，Spring Security 根据此 ID 从服务器的 Session 存储中取出 `SecurityContext` 来验证用户身份。


