import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createLightCycleMatch, startLightCycleRoundImmediately } from './tabletopCore.ts';
import { createLightCycleScoreboardModel } from './scoreboardModel.ts';

describe('light-cycle scoreboard model', () => {
  it('uses lobby presence before a match exists', () => {
    const model = createLightCycleScoreboardModel({
      state: null,
      joinCode: 'K7M2QX',
      presence: {
        p1: { name: 'Michael', connected: true, localized: true, ready: true },
        p2: { name: 'Alex', connected: true, localized: true, ready: false },
      },
    });
    assert.equal(model.player1.name, 'Michael');
    assert.equal(model.player2.name, 'Alex');
    assert.equal(model.match.phase, 'lobby');
    assert.equal(model.match.joinCode, 'K7M2QX');
  });

  it('maps authoritative scores and final-grid state', () => {
    const state = startLightCycleRoundImmediately(
      createLightCycleMatch({
        names: { p1: 'Michael', p2: 'Alex' },
        config: { roundsToWin: 5 },
      }),
    );
    state.scores.p1 = 4;
    state.scores.p2 = 4;
    const model = createLightCycleScoreboardModel({ state });
    assert.equal(model.player1.score, 4);
    assert.equal(model.player2.score, 4);
    assert.equal(model.match.finalGrid, true);
    assert.equal(model.match.phase, 'playing');
  });
});
