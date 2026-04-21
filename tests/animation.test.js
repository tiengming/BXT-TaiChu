import { expect, test, describe, beforeEach, vi } from 'vitest';
import * as THREE from 'three';
import { Cosmogony } from '../src/cosmogony.js';

// Mock Three.js WebGLRenderer
vi.mock('three', async () => {
  const actual = await vi.importActual('three');
  return {
    ...actual,
    WebGLRenderer: class {
      constructor() {
        this.domElement = document.createElement('canvas');
      }
      setSize() {}
      setPixelRatio() {}
      render() {}
    },
  };
});

describe('Cosmogony Engine', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'canvas-container';
    document.body.appendChild(container);
  });

  test('can be initialized', () => {
    const cosmogony = new Cosmogony('canvas-container');
    expect(cosmogony).toBeDefined();
    expect(cosmogony.scene).toBeDefined();
    expect(cosmogony.renderer).toBeDefined();
  });

  test('initializes chaos phase', () => {
    const cosmogony = new Cosmogony('canvas-container');
    cosmogony.initChaos();
    expect(cosmogony.particles).not.toBeNull();
    expect(cosmogony.scene.children.length).toBeGreaterThan(0);
  });
});
