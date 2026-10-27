import assert from 'node:assert/strict';

// Draft mode is explicit, staging-only and never a clean release attestation.
export function validateProvenance(release, {checkoutSha, workingTreeDirty, expectedSha=checkoutSha, mode='strict'}) {
  assert.match(checkoutSha, /^[a-f0-9]{40}$/, 'Cannot identify checked-out revision');
  assert.equal(expectedSha, checkoutSha, 'Expected CI revision differs from checked-out revision');
  assert.equal(release.sourceSha, checkoutSha, 'Build source SHA differs from checked-out revision; rebuild');
  assert.equal(typeof release.trackedChanges, 'boolean', 'Build dirty-source flag must be boolean');
  assert.ok(['strict','draft'].includes(mode), 'Unknown provenance validation mode');
  if(mode==='draft') {
    assert.equal(release.environment, 'staging', 'Draft validation is staging-only; production requires strict provenance');
  } else {
    assert.equal(release.trackedChanges, false, 'Build was made with dirty tracked source; commit and rebuild');
    assert.equal(workingTreeDirty, false, 'Checkout has tracked edits since the recorded build; commit and rebuild');
  }
  return {mode, checkoutSha, expectedSha, releaseVerified:mode==='strict'};
}
