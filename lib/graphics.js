import { WebGLRenderer } from 'pixi';

import { SCREEN_WIDTH, SCREEN_HEIGHT, SLATE_BLUE } from 'constants';

export const renderer = new WebGLRenderer(SCREEN_WIDTH, SCREEN_HEIGHT);
renderer.backgroundColor = SLATE_BLUE;
