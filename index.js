const fs = require('fs');
const ProgressBar = require('progressbar');
const colors = require('colors');

const files = fs.readdirSync(__dirname).filter(x => x.endsWith('.md') 
                                                 || x.endsWith('.mdown') 
                                                 || x.endsWith('.markdown')
                                                 && 
                                                 (!x.includes('INSTR.md') || !x.includes('CHANGELOG.md')));

let count = (input, occur) => {
  return input.split(occur).length - 1;
}

const headerMode = require('./modes.json').header_mode;
const displayFilename = require('./modes.json').display_filename;

files.forEach((element) => {
  fs.readFile(element, 'utf8', (err, data) => {
    if (err) {
      console.error('Error via reading file:', err);
      return;
    }
  
    const lines = data.split('\n');
  
    let totalTasks = 0;
    let completedWeightedTasks = 0;
    let totalWeight = 0;
    let currentHeader = '';
    let headerProgress = new Map();

    lines.forEach(line => {
      if (line.startsWith('## ')) {
        currentHeader = line.slice(3).trim();
        headerProgress.set(currentHeader, { totalTasks: 0, completedWeightedTasks: 0, totalWeight: 0 });
      }
      
      if (line.includes('- [')) {
        if (headerMode) {
          headerProgress.get(currentHeader).totalTasks++;
        } else {
          totalTasks++;
        }

        let weight = 1;
        const match = line.match(/\{([\d.]+)(?:[*+]|)/);

        let tabs = count(line, '    ');

        if (require('./modes.json').hierarchy_mode == false)
          tabs = 0;

        let coef = 1 + tabs;

        if (match) {
          const weightStr = match[1];
          if (weightStr === '*') {
            weight = 2;
          } else {
            weight = parseFloat(weightStr);
          }
          if (headerMode) {
            headerProgress.get(currentHeader).totalWeight += weight / coef;
          } else {
            totalWeight += weight / coef;
          }
        } else {
          if (headerMode) {
            headerProgress.get(currentHeader).totalWeight += (1 / coef);
          } else {
            totalWeight += (1 / coef);
          }
        }
        if (line.includes('[x]')) {
          if (headerMode) {
            headerProgress.get(currentHeader).completedWeightedTasks += weight / coef;
          } else {
            completedWeightedTasks += weight / coef;
          }
        }
      }
    });

    if (!headerMode) {
      if (totalWeight === 0) {
        console.log("There are no tasks with weights. Cannot calculate progress.");
        return;
      }
  
      const progress = completedWeightedTasks / totalWeight;
  
      const bar = ProgressBar.create();
      bar.step('arrange of completion');
  
      bar.setTotal(totalWeight);
      bar.setTick(completedWeightedTasks);
  
      let color = '';
      if (progress * 100 <= 33) color = 'red';
      else if (progress * 100 <= 66) color = 'yellow';
      else color = 'green';
  
      console.log(colors[color](`\nProgress: ${Math.round(progress * 100)}%`));
  
      bar.finish();
    } else {
      
      headerProgress.forEach((value, key) => {
        if (value.totalWeight === 0) {
          console.log(`There are no tasks with weights under header "${key}". Cannot calculate progress.`);
          return;
        } 

        const progress = value.completedWeightedTasks / value.totalWeight;

        const bar = ProgressBar.create();
        bar.step(`[${key}] Progress`);
        bar.setTotal(value.totalWeight);
        bar.setTick(value.completedWeightedTasks);

        let color = '';
        if (progress * 100 <= 33) color = 'red';
        else if (progress * 100 <= 66) color = 'yellow';
        else color = 'green';

        if(displayFilename)
          console.log(colors.underline(colors.magenta(element))); 
        
        console.log(colors[color](`\n${key} Progress: ${Math.round(progress * 100)}%`));
        
        bar.finish();
      });
    }
  });
});
