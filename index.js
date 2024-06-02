const readline = require('readline');
const fs = require('fs');
const table = require('table').table;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const bytesToSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
}

rl.question('What directory would you like to list? ', (answer) => {
answer = fs.realpathSync(answer.replace('~', require('os').homedir()).trim());
if(!fs.existsSync(answer)) return console.log('Directory does not exist');
rl.question('How many do you want displayed? (write "all" for everything) ', (answer2) => {
rl.question('Do you want to display the size of the directories, files or both? (write "f", "d" or "b") ', (answer3) => {
rl.question('Sort by size, name, modified date, or created date? (write "s", "n", "m", or "c") ', (answer4) => {
fs.readdir(answer, (err, files) => {
    if (err) {
        console.log('Error:', err);
        rl.close();
        return;
    }
    const arr = [];
    files.forEach((file) => {
        try{
        const stat = fs.statSync(answer + '/' + file);
        if(answer3 == 'f' && stat.isFile()) arr.push({ name: file, size: stat.size, type: 'file', created: stat.birthtime, modified: stat.mtime });
        if(answer3 == 'd' && stat.isDirectory()) arr.push({ name: file, size: stat.size, type: 'directory', created: stat.birthtime, modified: stat.mtime });
        if(answer3 == 'b') arr.push({ name: file, size: stat.size, type: stat.isDirectory() ? 'directory' : 'file', created: stat.birthtime, modified: stat.mtime });
    }catch{
        arr.push({ name: file, size: -1, type: 'unknown', created: 'unknown', modified: 'unknown' });
    }
    });
    arr.sort((a, b) => {
        if(answer4 == 's') return a.size - b.size;
        if(answer4 == 'n') return a.name.localeCompare(b.name);
        if(answer4 == 'm') return a.modified - b.modified;
        if(answer4 == 'c') return a.created - b.created;
    });
    if(parseInt(answer2) && answer2 < arr.length) arr.length = parseInt(answer2);
    console.clear()
    console.log(`${answer} sorted by ${answer4 == 's' ? 'size' : answer4 == 'n' ? 'name' : 'date'}. Displaying ${arr.length} of ${files.length} files.`);
    const tbl = table(arr.map((file) => { return [file.name, file.size == -1 ? 'unknown size' : bytesToSize(file.size), file.type, `Created ${new Date(file.created).toLocaleDateString()}`, `Modified ${new Date(file.modified).toLocaleDateString()}`] }), { border:{  topBody: `─`, topJoin: `┬`, topLeft: `┌`, topRight: `┐`, bottomBody: `─`, bottomJoin: `┴`, bottomLeft: `└`, bottomRight: `┘`, bodyLeft: `│`, bodyRight: `│`, bodyJoin: `│`, joinBody: `─`, joinLeft: `├`, joinRight: `┤`, joinJoin: `┼` } });
    console.log(tbl);
    rl.close();
});
})
})
})
})
