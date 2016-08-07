var fs = require('fs');
var async = require('async');

var DOCUMENTATION_TOP =
  '# KABEMS\n\n' +
  '> KABEMS Version 1 Grammar for SCSS with KABEMS and BEM methodologies based on [SCSS Version 2 Grammar by Mario "Kuroir" Ricalde](https://github.com/MarioRicalde/SCSS.tmbundle)\n\n' +
  '## Installation\n\n' +
  '### With Package Control\n\n' +
  'See http://wbond.net/sublime_packages/package_control/installation for instructions.\n\n' +
  'Open the palette (Control+Shift+P or Command+Shift+P) in Sublime Text and select Package Control: Install Package and then select "KABEMS" from the list.\n\n' +
  '### Manually\n\n' +
  ' * cd <YOUR PACKAGES DIRECTORY> (eg. ~/Library/Application\ Support/Sublime\ Text\ 3/Packages)\n' +
  ' * git clone https://github.com/konstantin24121/sublime-kabems\n\n' +
  'Also hightlighter work with classic BEM\n\n' +
  'Support Monokai Extended Theme\n\n' +
  '![Example](https://raw.githubusercontent.com/konstantin24121/sublime-kabems/docs/img/example.jpg)\n\n' +
  '#### Documentation of available snippets (SCSS):\n\n' +
  '```\n';

var DOCUMENTATION_BOTTOM =
  '```\n\n' +
  'All snippets compatible with Emmet\n\n' +
  '## License\n\n' +
  '##### Copyright (c) 2016 Konstantin Viikset\n\n';

fs.readdir('./snippets/scss', function(err, files) {
  var snippets = files.filter(function(file) {
    return file.substr(-16) === '.sublime-snippet';
  }).map(function(file) {
    return './snippets/scss/' + file;
  });
  async.map(snippets, readAndInspect, function(err, results) {
    if (err) {
      console.error('error mapping snippets', err);
    }
    var snippetDocs =
      DOCUMENTATION_TOP +
      results.map(function(snippet) {
        return inspectFile(snippet);
      }).sort(function(a, b) {
        return a.abbreviation > b.abbreviation
          ? 1
          : a.abbreviation === b.abbreviation
            ? 0
            : -1;
      }).map(function(snippet) {
        return snippet.docBlock;
      }).join('') +
      DOCUMENTATION_BOTTOM;
    fs.writeFile('README.md', snippetDocs, function (err) {
      if (err) {
        console.error('error appending README:', err);
      }
    });
  });
});

function readAndInspect(fileName, cb) {
  fs.readFile(fileName, 'utf-8', function(err, contents) {
    if (!err) {
      cb(null, contents);
    }
  });
}

function inspectFile(contents) {
  var match = contents.match(
    /[\s\S]*<tabTrigger>(.*?)<\/tabTrigger>[\s\S]*?<description>(KBEMS: )?(.*?)<\/description>[\s\S]*/i
  );
  var docBlock = '';
  var abbreviation = '';
  var description = '';
  if (match !== null) {
    abbreviation = match[1];
    description = match[3];
    var shortCut = '     '.substring(0, 5 - abbreviation.length) + abbreviation;
    docBlock = '  ' + shortCut + ' → ' + description + '\n\n';
  }
  return {
    docBlock: docBlock,
    abbreviation: abbreviation,
    description: description
  };
}
