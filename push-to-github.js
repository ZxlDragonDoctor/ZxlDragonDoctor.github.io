const git = require('isomorphic-git');
const fs = require('fs');
const path = require('path');

const dir = 'D:\\personal_Blog\\ZxlDragonDoctor.github.io';

async function main() {
  // Check status
  const status = await git.statusMatrix({ fs, dir });
  
  const changed = status.filter(([filepath, head, workdir, stage]) => {
    return head !== workdir || head !== stage || workdir !== stage;
  });
  
  console.log('Changed files:');
  changed.forEach(([filepath]) => console.log('  ' + filepath));

  // Add all files to staging
  console.log('\nStaging files...');
  for (const [filepath] of changed) {
    try {
      await git.add({ fs, dir, filepath });
      console.log('  Added: ' + filepath);
    } catch (e) {
      console.log('  Skipped (error): ' + filepath + ' - ' + e.message);
    }
  }

  // Create commit
  console.log('\nCreating commit...');
  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'opencode',
      email: 'opencode@users.noreply.github.com'
    },
    message: 'Add photo album: 游颐和园 (128 photos)'
  });
  console.log('Commit SHA:', sha);

  // Push to remote
  console.log('\nPushing to GitHub...');
  try {
    await git.push({
      fs,
      dir,
      remote: 'origin',
      ref: 'main',
      onAuth: () => ({ username: process.env.GIT_USERNAME, password: process.env.GIT_TOKEN }),
      onProgress: (p) => {
        if (p.phase === 'counting') console.log(`Counting: ${p.loaded}/${p.total}`);
        if (p.phase === 'pushing') console.log(`Pushing: ${p.loaded}/${p.total}`);
      }
    });
    console.log('\nPush successful!');
  } catch (err) {
    console.error('\nPush failed:', err.message);
    console.log('\nThe commit was created locally. To push, you need to provide GitHub credentials.');
    console.log('Run the following command with your credentials:');
    console.log('  $env:GIT_USERNAME="ZxlDragonDoctor"');
    console.log('  $env:GIT_TOKEN="your-github-token"');
    console.log('  node push-to-github.js');
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
