---
title: "demo1表设计"
date: 2025-09-02 21:04:00
updated: 2025-09-02 21:04:00
categories:
  - 学习总结
---

```sql
DROP TABLE IF EXISTS `purchase_apply`;
CREATE TABLE `purchase_apply` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `purchase_apply_no` varchar(20) NOT NULL COMMENT '采购申请单编号',
  `status` tinyint(4) NOT NULL DEFAULT '10' COMMENT '5 已取消 10 编辑中  20 已提交  25部分引用  30 已引用',
  `creator_id` int(11) NOT NULL,
  `warehouse_id` smallint(6) NOT NULL DEFAULT '0',
  `expected_time` datetime DEFAULT NULL COMMENT '期望到货时间',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `version_id` int(11) NOT NULL DEFAULT '0' COMMENT '版本号',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='采购申请单';
```

```
DROP TABLE IF EXISTS `purchase_apply_detail`;
CREATE TABLE `purchase_apply_detail` (
  `rec_id` int(11) NOT NULL AUTO_INCREMENT,
  `apply_id` int(11) NOT NULL,
  `spec_id` int(11) NOT NULL,
  `num` decimal(19,4) NOT NULL,
  `recommand_num` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '理论数量、推荐数量',
  `real_num` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '实际数量',
  `ref_num` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '已经引用的的数量',
  `unit` int(11) NOT NULL DEFAULT '0',
  `remark` varchar(255) NOT NULL DEFAULT '',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rec_id`),
  UNIQUE KEY `U_PURCHASE_APPLY_DETAIL_APID_SPID` (`apply_id`,`spec_id`),
  KEY `FK_purchase_apply_detail_apply_id` (`apply_id`),
  CONSTRAINT `FK_purchase_apply_detail_apply_id` FOREIGN KEY (`apply_id`) REFERENCES `purchase_apply` (`rec_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='采购申请单';
```

```sql
DROP TABLE IF EXISTS `goods_spec`;
CREATE TABLE `goods_spec` (
  `spec_id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL,
  `spec_no` varchar(40) NOT NULL COMMENT '商家编码，可以将货品的goods_no和spec_code拼在一起,由程序自动管理',
  `spec_code` varchar(40) NOT NULL COMMENT '规格码',
  `provider_id` int(11) NOT NULL DEFAULT '0' COMMENT '主供应商，注意：修改的时候要和purchase_provider_goods表连动',
  `barcode` varchar(50) NOT NULL DEFAULT '' COMMENT '主条码，注意：修改的时候要和goods_barcode表连动',
  `spec_name` varchar(100) NOT NULL,
  `wms_process_mask` tinyint(4) NOT NULL DEFAULT '0' COMMENT '仓库流程控制掩码:1.允许负库存出库 2.无需验货 4.使用同批 8.需要质检 16.无需拣货',
  `is_not_need_examine` tinyint(1) NOT NULL DEFAULT '0' COMMENT '不需要验货',
  `goods_label` int(11) NOT NULL DEFAULT '0' COMMENT '货品标签 mask 自定义属性6个,1,航空禁运 2,陆路禁运 4,自定义3 8,自定义4 16,自定义5 32,自定义6',
  `sn_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0不启用序列号 1强序列号 2弱序列号',
  `is_single_batch` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0,不启用同一批次，1,使用同一批次',
  `lowest_price` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '最低',
  `retail_price` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '零售价',
  `wholesale_price` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '批发价',
  `member_price` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '会员价',
  `market_price` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '市场价',
  `custom_price1` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '自定义价格1',
  `custom_price2` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '自定义价格2',
  `validity_days` smallint(6) NOT NULL DEFAULT '0' COMMENT '保质期，天数',
  `sales_days` int(11) NOT NULL DEFAULT '0' COMMENT '最佳销售天数',
  `receive_days` int(11) NOT NULL DEFAULT '0' COMMENT '最佳收货天数',
  `weight` decimal(19,4) NOT NULL DEFAULT '0.0000' COMMENT '重量',
  `length` decimal(19,4) NOT NULL DEFAULT '0.0000',
  `width` decimal(19,4) NOT NULL DEFAULT '0.0000',
  `height` decimal(19,4) NOT NULL DEFAULT '0.0000',
  `washing_label` varchar(40) NOT NULL DEFAULT '' COMMENT '水洗标',
  `tax_rate` decimal(8,4) NOT NULL DEFAULT '0.0000' COMMENT '税率',
  `tax_code_id` int(11) NOT NULL DEFAULT '0' COMMENT '税务编码id',
  `large_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0非大件1普通大件2独立大件（不可和小件一起发）-1非单发件',
  `unit` smallint(6) NOT NULL DEFAULT '0' COMMENT '基本单位',
  `aux_unit` smallint(6) NOT NULL DEFAULT '0' COMMENT '辅助单位',
  `prop1` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性1',
  `prop2` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性2',
  `prop3` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性3',
  `prop4` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性4',
  `prop5` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性5',
  `prop6` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性6',
  `flag_id` int(11) NOT NULL DEFAULT '0' COMMENT '标记',
  `is_lower_cost` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否允许低于成本价',
  `img_url` varchar(1024) NOT NULL DEFAULT '' COMMENT '图片URL',
  `img_key` varchar(100) NOT NULL DEFAULT '' COMMENT '看图片在外部空间的key  比如说 云盘的一个 外链',
  `barcode_count` smallint(6) NOT NULL DEFAULT '0' COMMENT '条码个数',
  `plat_spec_count` smallint(6) NOT NULL DEFAULT '0' COMMENT '平台货品数量(不包含删除的)',
  `is_need_inspect` tinyint(1) NOT NULL DEFAULT '0' COMMENT '需要质检',
  `remark` varchar(512) NOT NULL DEFAULT '' COMMENT '备注',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '删除时间戳',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`spec_id`),
  UNIQUE KEY `UX_goods_spec_no` (`spec_no`,`deleted`),
  KEY `FK_goods_spec_goods_id` (`goods_id`),
  KEY `IX_goods_spec_barcode` (`barcode`),
  KEY `IX_goods_spec_deleted` (`deleted`),
  KEY `IX_goods_spec_modified` (`modified`),
  CONSTRAINT `FK_goods_spec_goods_id` FOREIGN KEY (`goods_id`) REFERENCES `goods_goods` (`goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='货品规格';
```

```sql
DROP TABLE IF EXISTS `goods_goods`;
CREATE TABLE `goods_goods` (
  `goods_id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1销售商品 2原材料 3包装 4周转材料5虚拟商品6固定资产 0其它',
  `goods_no` varchar(40) NOT NULL COMMENT '货品编码，必须唯一，可以系统生成',
  `goods_name` varchar(255) NOT NULL COMMENT '货品名称',
  `short_name` varchar(255) NOT NULL DEFAULT '' COMMENT '简称',
  `alias` varchar(255) NOT NULL DEFAULT '' COMMENT '别名',
  `spec_count` int(11) NOT NULL DEFAULT '0' COMMENT '多规格个数',
  `class_id` int(11) NOT NULL DEFAULT '0' COMMENT '分类id,0表示无分类',
  `brand_id` int(11) NOT NULL DEFAULT '0' COMMENT '品牌ID',
  `unit` int(11) NOT NULL DEFAULT '0' COMMENT '基本单位',
  `aux_unit` int(11) NOT NULL DEFAULT '0' COMMENT '辅助单位',
  `pinyin` varchar(40) NOT NULL DEFAULT '',
  `origin` varchar(64) NOT NULL DEFAULT '' COMMENT '产地',
  `remark` varchar(512) NOT NULL DEFAULT '',
  `flag_id` int(11) NOT NULL DEFAULT '0',
  `properties` varchar(1024) NOT NULL DEFAULT '0,0,0,0,0,0',
  `washing_label` varchar(20) NOT NULL DEFAULT '',
  `category_id` int(11) NOT NULL DEFAULT '0' COMMENT '系统商品类目id',
  `prop1` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性1',
  `prop2` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性2',
  `prop3` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性3',
  `prop4` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性4',
  `prop5` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性5',
  `prop6` varchar(255) NOT NULL DEFAULT '' COMMENT '自定义属性6',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '删除时间',
  `version_id` int(11) NOT NULL DEFAULT '0' COMMENT '版本号，用来检查同时修改的',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`goods_id`),
  UNIQUE KEY `UK_goods_goods_no` (`goods_no`,`deleted`),
  KEY `IX_goods_goods_deleted` (`deleted`),
  KEY `FK_goods_goods_class_id` (`class_id`),
  KEY `FK_goods_goods_brand_id` (`brand_id`),
  KEY `IX_goods_goods_type` (`goods_type`),
  KEY `IX_goods_goods_modified` (`modified`),
  KEY `IX_goods_goods_catid`(`category_id`),
  CONSTRAINT `FK_goods_goods_brand_id` FOREIGN KEY (`brand_id`) REFERENCES `goods_brand` (`brand_id`),
  CONSTRAINT `FK_goods_goods_class_id` FOREIGN KEY (`class_id`) REFERENCES `goods_class` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='货品表';
```