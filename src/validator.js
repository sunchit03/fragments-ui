import Papa from 'papaparse';
import { HtmlValidate } from 'html-validate/browser';
const yaml = require('js-yaml');

const htmlvalidate = new HtmlValidate();

export const acceptedTypes = {
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'text/html': ['.html'],
  'text/csv': ['.csv'],
  'application/json': ['.json'],
  'application/yaml': ['.yaml'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
};

async function validateHTML(content) {
  const report = await htmlvalidate.validateString(content);
  return report.valid;
}

function validateCSV(content) {
  const { data, errors } = Papa.parse(content, { skipEmptyLines: true });
  if (errors.length > 0 || data.length === 0) {
    return false;
  }
  return true;
}

function validateJSON(data) {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
}

async function validateYAML(input) {
  try {
    yaml.load(input);
    return true;
  } catch (e) {
    return false;
  }
}

export async function validator(type, content) {
  if (type === 'text/csv' && !validateCSV(content)) {
    return { success: false, message: 'Invalid CSV format' };
  }

  if (type === 'text/html' && !(await validateHTML(content))) {
    return { success: false, message: 'Invalid HTML format' };
  }

  if (type === 'application/json' && !validateJSON(content)) {
    return { success: false, message: 'Invalid JSON format' };
  }

  if (type === 'application/yaml' && !validateYAML(content)) {
    return { success: false, message: 'Invalid YAML format' };
  }

  return { success: true };
}
