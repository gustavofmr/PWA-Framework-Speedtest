import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const writeJsFile = (jsContent: string, filePath) => {
  try {
    fs.writeFileSync(`${filePath}`, jsContent);
  } catch (error) {
    console.error(
      `Error occurred during write to: ${filePath}:

      ${error}

      for the following output:

      ${jsContent}

      `
    );
  }
};

const convertCssVarsToJs = (cssFilePath) => {
  const globalPrefix = '--beam-';

  const namespaces = {
    colors: 'color-',
    spacing: 'spacings-',
  };

  console.log(`* Reading in CSS file ${path.join(__dirname, cssFilePath)}`);
  const cssContent = fs.readFileSync(path.join(`${__dirname}/${cssFilePath}`), {
    encoding: 'utf8',
  });

  const exportBlockStart = ':export {';
  const exportBlockEnd = '}';
  const cssVarsList = cssContent
    .replace(exportBlockStart, '')
    .split(exportBlockEnd)[0]
    .split(';');

  console.log(`* Trimming variables we don't need from the CSS file`);
  const trimAndFilterIncorrectCssVars = (cssVarsList) =>
    cssVarsList
      .map((cssEntry) => cssEntry.replace(/\s|"/g, ''), {})
      .filter((cssEntry) => cssEntry.startsWith(globalPrefix)) || [];

  /*
    groups a color and it's gradients to a js object
      blue: {
        100: '#ccf0ff',
        200: '#9be1ff',
        ...
      }
  */
  const groupCssColors = (listOfJsVars: Record<string, unknown>) => {
    console.log(`* Grouping Colors into a JS object`);
    // get the colors
    const colors = Array.from(
      new Set(
        [Object.keys(listOfJsVars['colors'])][0].map((value) => {
          return value.split(/[0-9]/)[0];
        })
      )
    );

    // filter the colors to form new object
    const colorsObject = {};
    for (const color of colors) {
      const colorValues = Object.entries(
        listOfJsVars['colors']
      ).filter((value) => value[0].includes(color));

      // make the new object
      if (colorValues.length > 1)
        colorsObject[color] = colorValues.reduce(
          (obj, value) =>
            Object.assign(obj, { [value[0].replace(/\D/g, '')]: value[1] }),
          {}
        );
      else {
        // if it is a 1 to 1 just add the obj value from the original list
        colorsObject[color] = listOfJsVars['colors'][color];
      }
    }

    listOfJsVars['colors'] = colorsObject;
    return listOfJsVars;
  };

  const convertToKeyValuePairsAndGroup = (cssVarsList) => {
    const list = cssVarsList.reduce((accumulatedCssVars, current) => {
      const [_key, value] = current.split(':');

      const key = _key.replace(globalPrefix, '');

      const [groupKey, cssPrefix] =
        Object.entries(namespaces).find(([, cssPrefix]) =>
          key.startsWith(cssPrefix)
        ) || [];

      const group = groupKey && {
        ...accumulatedCssVars[groupKey],
        [key.replace(cssPrefix, '')]: value,
      };
      return {
        ...accumulatedCssVars,
        ...(group ? { [groupKey]: group } : { [key]: value }),
      };
    }, {});

    const listWithColorObject = groupCssColors(list);
    return listWithColorObject;
  };

  const filteredCssVars = trimAndFilterIncorrectCssVars(cssVarsList);

  console.log(`* Converting to key value pairs and groups`);
  const jsVars = convertToKeyValuePairsAndGroup(filteredCssVars);

  console.log(`* Creating export strings for our namespaces`);
  const jsContent = Object.entries(jsVars).reduce(
    (totalExportString, [key, value]) => {
      const jsExportString = `export const ${key} = ${JSON.stringify(
        value
      )} as const;`;
      return (totalExportString += jsExportString);
    },
    ''
  );

  const tsVarsFilePath = path.join(__dirname, '../beam-vars.ts');
  console.log(`* Writing Js variables to js file ${tsVarsFilePath}`);
  writeJsFile(jsContent, tsVarsFilePath);
  execSync(`yarn nx format:write --files ${tsVarsFilePath}`);
};

console.log(`* Preparing to convert Css Vars to JS`);
convertCssVarsToJs('../styles/beam-vars.css');
