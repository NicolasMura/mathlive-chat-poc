#! /usr/bin/env node

/**
* IBuildInfos interface and typings
*/
import { IBuildInfos } from '../libs/frontend-tools/src/lib/models/build-infos.model';

/**
* Dependencies
*/
import { exec } from 'child_process';
import { promises as fs } from 'fs';
import * as moment from 'moment';
import * as prompts from 'prompts';
import * as signale from 'signale';
import { promisify } from 'util';
const execAsync = promisify(exec);

/**
* Information sources
*/
// tslint:disable-next-line: no-var-requires
const version = require(`${process.cwd()}/package.json`).version;
const args: string[] = process.argv.slice(2);
const argsMinimist = require('minimist')(process.argv.slice(2));
const opts: string[] = [
  '--help', // Shows manual
  '--init', // Perform initial setup
  '--no-hash', // Don't show commit hash in build info
  '--no-user', // Don't show git user in build info
  '--no-version', // Don't show package version in build info
  '--no-time', // Don't show timestamp in build info
  '--no-message', // Don't add build message,
  '--admin', // Specify if build.ts file is for public or admin app,
  '--jenkinsBuildNumber', // ${BUILD_ID} Jenkins Build number,
];

// Path we write the file to, should match your Angular projects `src/` folder
let exportPath = '';

/**
* Get relevant build information
*/
async function getGitUser(buildHash: string): Promise<string | undefined> {
  // const { stdout, stderr } = await execAsync('git config user.name');
  const { stdout, stderr } = await execAsync('git show ' + buildHash + ' | grep Author');
  if (stderr) {
    signale.error('Error getting git user, skipping...');
    return undefined;
  } else {
    signale.success('Found git user:', stdout.replace('\n', ''));
    return stdout.replace('\n', '');
  }
}

async function getCommitHash(): Promise<string | undefined> {
  const { stdout, stderr } = await execAsync('git rev-parse --short HEAD');
  if (stderr) {
    signale.error('Error getting latest commit hash, skipping...');
    return undefined;
  } else {
    signale.success('Found commit hash:', stdout.replace('\n', ''));
    return stdout.replace('\n', '');
  }
}

async function getBuildMessage(): Promise<string | undefined> {
  const response = await prompts({
    type: 'text',
    name: 'message',
    message: 'Add build message? (optional)',
  });
  return response.message === '' ? undefined : response.message;
}

async function buildInfos(): Promise<void> {
  signale.start('Collecting build information...');

  // Check provided args if they exist
  // args.map((arg: any) => {
  //     if (!opts.includes(arg)) {
  //         signale.error(`Error: Unknown arg '${arg}', please re-check arguments before running the tool again!`);
  //         process.exit(1);
  //     }
  // });

  // Object we store build info in
  const build: IBuildInfos = {};

  if (!args.includes('--no-hash')) {
    build.hash = await getCommitHash();

    if (!args.includes('--no-user') && build.hash) {
      build.user = await getGitUser(build.hash);
      if (build.user) {
        build.user = build.user.substring(8);
      }
    }
  }

  //   if (!args.includes('--no-user')) {
  //       build.user = await getGitUser();
  //   }

  if (!args.includes('--no-message')) {
    build.message = await getBuildMessage();
  }

  if (!args.includes('--no-version')) {
    build.version = version;
  }

  if (args.includes('--admin')) {
    exportPath = process.cwd() + '/apps/frontend-admin/src/build.ts';
  } else {
    exportPath = process.cwd() + '/apps/frontend-public/src/build.ts';
  }

  if (args.includes('--jenkinsBuildNumber')) {
    build.jenkinsBuildNumber = argsMinimist.jenkinsBuildNumber;
  }

  if (!args.includes('--no-time')) {
    build.timestamp = moment().format('MMMM DD, YYYY HH:mm:ss');
  }

  signale.info(build);

  // Try writing file, if it fails, display error message
  try {
    await fs.writeFile(
      exportPath,
      '// Angular build information, automatically generated by `generate-build-infos` script\n' +
        'export const buildInfos = ' +
        JSON.stringify(build, null, 2).replace(/\"([^(\")"]+)\":/g, '$1:') +
        ';\n'
      );
      signale.success(`Saved build information to \`${exportPath}\``);
  } catch (error) {
    signale.error(
      `An error occured writing to \`${exportPath}\`, does the path exist?`
    );
    signale.error(error);
  }
}

async function init(): Promise<void> {
  signale.info('Welcome to `angular-build-info`!');
  signale.info(
    `We will now create a boilerplate \`build.ts\` file in \`${exportPath}\`\
    and fill it with basic information so you can start implementing it in your front-end.`
  );
  signale.info(
    `If you wish for more info on how to implement the provided info in your Angular app,\
    feel free to check out the main repo over at https://github.com/4dams/angular-build-info`
  );

  signale.start('Creating `build.ts` file...');

  const template: IBuildInfos = {
    hash: '1e872b5',
    timestamp: moment().format('MMMM DD, YYYY HH:mm:ss'),
    jenkinsBuildNumber: 12345,
    user: 'Octocat',
    version: '1.0.0'
  };

  // Try writing file, if it fails, display error message
  try {
    await fs.writeFile(
      exportPath,
      '// Angular build information, automatically generated by `angular-build-info`\n' +
        'export const buildInfos = ' +
        JSON.stringify(template, null, 4).replace(/\"([^(\")"]+)\":/g, '$1:') +
        ';\n'
    );

    signale.success('Successfully created `build.ts` file!');
    signale.info(
      `You should now modify your build/deploy scripts in your \`package.json\` file\
      to run this script every time before your Angular app is built. An example would be:`
    );
    signale.info(`[...] 'build': 'build-info && ng build --prod', [...]`);
    signale.info(
      'Again, you can find more info on implementing this tool on the main repo.'
    );
  } catch (error) {
    signale.error(
      `An error occured writing to \`${exportPath}\`, does the path exist?`
    );
    signale.error(error);
  }
}

async function displayManual(): Promise<void> {
  signale.info('Welcome to `angular-build-info`!');
  signale.info('');
  signale.info('--help                  Displays this message');
  signale.info('--init                  Creates template `build.ts` file so you can start implementing it');
  signale.info('--no-hash               Will not add latest commit hash to final `build.ts`');
  signale.info('--no-user               Will not add git username to final `build.ts`');
  signale.info('--no-version            Will not add version from `package.json` to `build.ts`');
  signale.info('--jenkinsBuildId        Will add Build id from ${BUILD_ID} Jenkins variable to `build.ts`');
  signale.info('--no-time               Will not add timestamp to final `build.ts`');
  signale.info('--no-message            Will not prompt for a build message, leaving it undefined');
}

/**
* Main function we run upon starting the script
*/
function start(): void {
  if (args.includes('--init')) {
    init();
    return;
  }

  if (args.includes('--help')) {
    displayManual();
    return;
  }

  buildInfos();
}

start();
