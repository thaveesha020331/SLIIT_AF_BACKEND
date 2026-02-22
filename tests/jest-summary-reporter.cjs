/**
 * Jest custom reporter: prints pass/fail and Positive / Negative / Edge case counts.
 */
class SummaryReporter {
  constructor(_globalConfig, options) {
    this._globalConfig = _globalConfig;
    this._options = options;
  }

  onRunComplete(_contexts, results) {
    let positive = 0, negative = 0, edge = 0;
    let positivePass = 0, positiveFail = 0, negativePass = 0, negativeFail = 0, edgePass = 0, edgeFail = 0;

    for (const tr of results.testResults || []) {
      for (const r of tr.testResults || []) {
        const name = (r.fullName || r.title || '').trim();
        const pass = r.status === 'passed';
        if (name.includes('(Positive)')) {
          positive++;
          if (pass) positivePass++; else positiveFail++;
        } else if (name.includes('(Negative)')) {
          negative++;
          if (pass) negativePass++; else negativeFail++;
        } else if (name.includes('(Edge)')) {
          edge++;
          if (pass) edgePass++; else edgeFail++;
        }
      }
    }

    const passed = positivePass + negativePass + edgePass;
    const failed = positiveFail + negativeFail + edgeFail;
    const total = positive + negative + edge;

    console.log('\n--- Thaveesha Cart & Order test summary ---');
    console.log(`Total:   ${passed} passed, ${failed} failed, ${total} total`);
    console.log(`Positive: ${positivePass} passed, ${positiveFail} failed (${positive} total)`);
    console.log(`Negative: ${negativePass} passed, ${negativeFail} failed (${negative} total)`);
    console.log(`Edge:     ${edgePass} passed, ${edgeFail} failed (${edge} total)`);
    console.log('-------------------------------------------\n');
  }
}

module.exports = SummaryReporter;
