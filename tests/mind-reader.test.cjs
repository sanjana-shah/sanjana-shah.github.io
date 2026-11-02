const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../assets/portfolio/mind-reader.js'), 'utf8') + '\nthis.tree = mindReaderTree;', sandbox);
const tree = sandbox.tree;

test('honest answers identify every number from 1 through 40', () => {
  for (let number = 1; number <= 40; number++) {
    let node = 'start';
    const visited = new Set();
    while (typeof node === 'string') {
      assert(!visited.has(node), `cycle on the path for ${number}`);
      visited.add(node);
      assert(tree[node], `missing decision table ${node}`);
      const [table, yes, no] = tree[node];
      node = table.includes(number) ? yes : no;
    }
    assert.equal(node, number, `incorrect guess for ${number}`);
    assert(visited.size <= 7, `too many questions for ${number}`);
  }
});

test('every branch terminates in one of 40 distinct results', () => {
  const results = [];
  const visited = new Set();
  function walk(node, ancestors = new Set()) {
    if (typeof node === 'number') { results.push(node); return; }
    assert(!ancestors.has(node), `cycle at ${node}`);
    const branch = tree[node];
    assert(branch, `missing table ${node}`);
    visited.add(node);
    const [table, yes, no] = branch;
    assert.equal(table.length, new Set(table).size, `duplicate table entry at ${node}`);
    assert(table.every(n => Number.isInteger(n) && n >= 1 && n <= 46));
    const next = new Set([...ancestors, node]);
    walk(yes, next); walk(no, next);
  }
  walk('start');
  assert.equal(visited.size, Object.keys(tree).length);
  assert.deepEqual(results.sort((a,b)=>a-b), Array.from({length:40},(_,i)=>i+1));
});
