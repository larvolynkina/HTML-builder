const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writeStream = new fs.WriteStream(
  path.join(__dirname, 'text.txt'),
  'utf8'
);

stdout.write('Enter your message:\n');

stdin.on('data', (data) => {
  const correctData = data.toString();
  if (correctData.match('exit')) {
    process.exit();
  } else {
    writeStream.write(data);
  }
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => {
  writeStream.end();
  stdout.write('Thanks for checking and good luck!');
});
