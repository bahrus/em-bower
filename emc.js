// @ts-check
import { BeHive, seed, MountObserver } from 'be-hive/be-hive.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/em-bower/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    base: 'em-bower',
    branches: ['', 'src'],
    map: {
        '0.0': {
            instanceOf: 'String',
            mapsTo: 'path',
        },
        '1.0': {
            instanceOf: 'String',
            mapsTo: 'src',
        }
    },
    enhPropKey: 'emBower',
    importEnh: async () => {
        const { EmBower } = await import('./em-bower.js');
        return EmBower;
    },
};
const mose = seed(emc);
MountObserver.synthesize(document, BeHive, mose);
