import * as babel from '@babel/parser';

import babelTraverse from '@babel/traverse';
import fs from 'fs';
import path from 'path';

const visitedComponents = new Set();
const componentMap = new Map();

function parseComponent(filePath) {
  if (visitedComponents.has(filePath)) return componentMap.get(filePath);
  visitedComponents.add(filePath);

  const code = fs.readFileSync(filePath, 'utf-8');
  const ast = babel.parse(code, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });

  const node = {
    name: path.basename(filePath),
    children: [],
  };

  const importedItems = new Map();

  babelTraverse.default(ast, {
    ImportDeclaration(importPathNode) {
      const importedPath = importPathNode.node.source.value;
      if (importedPath.startsWith('.')) {
        const fullPath = path.resolve(path.dirname(filePath), importedPath);
        const tsFilePath =
          fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')
            ? fullPath
            : fullPath + (fs.existsSync(fullPath + '.tsx') ? '.tsx' : '.ts');
        
        if (fs.existsSync(tsFilePath)) {
          importPathNode.node.specifiers.forEach(specifier => {
            importedItems.set(specifier.local.name, tsFilePath);
          });
        }
      }
    },

    JSXOpeningElement(jsxNode) {
      const jsxName = jsxNode.node.name.name;
      if (jsxName && importedItems.has(jsxName)) {
        const importPath = importedItems.get(jsxName);
        if (importPath) {
          const childNode = parseComponent(importPath);
          if (childNode && !node.children.some(c => c.name === childNode.name)) {
            node.children.push(childNode);
          }
        }
      }
    },

    CallExpression(callPathNode) {
      const callee = callPathNode.node.callee;
      if (callee.type === 'Identifier' && /^use[A-Z]/.test(callee.name)) {
        if (importedItems.has(callee.name)) {
          const hookPath = importedItems.get(callee.name);
          const hookNode = parseComponent(hookPath);
          if (hookNode && !node.children.some(c => c.name === hookNode.name)) {
            node.children.push(hookNode);
          }
        }
      }
    },

    VariableDeclarator(varPathNode) {
      const init = varPathNode.node.init;
      if (init && init.type === 'CallExpression') {
        const callee = init.callee;
        if (callee.type === 'Identifier' && importedItems.has(callee.name)) {
          const varPath = importedItems.get(callee.name);
          const varNode = parseComponent(varPath);
          if (varNode && !node.children.some(c => c.name === varNode.name)) {
            node.children.push(varNode);
          }
        }
      }
    }
  });

  componentMap.set(filePath, node);
  return node;
}

const entryPoint = path.resolve(process.cwd(), 'src/views/Project/Project.tsx');
const componentTree = parseComponent(entryPoint);

fs.writeFileSync('componentTree.json', JSON.stringify(componentTree, null, 2));






