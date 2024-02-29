const fs = require('fs');
const ProgressBar = require('progressbar');
const colors = require('colors');

const files = fs.readdirSync(__dirname).filter(x => x.endsWith('.md') 
                                                 || x.endsWith('.mdown') 
                                                 || x.endsWith('.markdown'));

let count = (input, occur) => {
  return input.split(occur).length - 1;
}

files.forEach(async (element) => {
  fs.readFile(element, 'utf8', (err, data) => {
    if (err) {
      console.error('Error via reading file:', err);
      return;
    }
  
    const lines = data.split('\n');
  
    let totalTasks = 0;
    let completedWeightedTasks = 0;
    let totalWeight = 0;
  
    lines.forEach(line => {
      if (line.includes('- [')) {
        totalTasks++;
        let weight = 1;
        const match = line.match(/\{([\d.]+)(?:[*+]|$)/);

        let tabs = count(line, '    ');

        if(require('./modes.json').hierarchy_mode == false)
          tabs = 0;

        let coef = 1 + tabs;

        console.log(tabs);

        if (match) {
          const weightStr = match[1];
          if (weightStr === '*') {
            weight = 2;
          } else {
            weight = parseFloat(weightStr);
          }
          totalWeight += weight/coef; 
        } else {
          totalWeight += (1/coef); 
        }
        if (line.includes('[x]')) {
          completedWeightedTasks += weight/coef;
        }
      }
    });
  
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
  });
});
