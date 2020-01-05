#!/usr/bin/env node

'use strict';

require('colorful').colorful();
const gulp = require('gulp');
const program = require('commander');
console.log(process.hrtime())
program.on('--help', () => {
  console.log('  Usage:'.to.bold.blue.color);
});

program.parse(process.argv);

function runTask(toRun) {
  const metadata = { task: toRun };
  // Gulp >= 4.0.0 (doesn't support events)
  // 实例化task
  const taskInstance = gulp.task(toRun);
  // 如果实例化失败则又gulp报错
  if (taskInstance === undefined) {
    gulp.emit('task_not_found', metadata);
    return;
  }
  const start = process.hrtime();
  // gulp记录task启动时间
  gulp.emit('task_start', metadata);
  try {
    taskInstance.apply(gulp);
    metadata.hrDuration = process.hrtime(start);
    gulp.emit('task_stop', metadata);
    gulp.emit('stop');
  } catch (err) {
    err.hrDuration = process.hrtime(start);
    err.task = metadata.task;
    gulp.emit('task_err', err);
  }
}

const task = program.args[0];
// task 取命令行中第一个参数
if (!task) {
  // 如果没有task，调用program组件中的help API
  program.help();
} else {
  console.log('antd-tools run', task);

  // require('../gulpfile');

  runTask(task);
}
