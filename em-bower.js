// @ts-check
import { propInfo, rejected, resolved } from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';
/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP} from './ts-refs/em-bower/types' */;


/**
 * @implements {Actions}
 * 
 */
class EmBower extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement>}
     */
    static config = {
        propDefaults: {
        },
        propInfo: {
            ...propInfo,
        },
        positractions: [resolved, rejected],
        actions: {
            
        }
    };

    de = de;
}

await EmBower.bootUp();
export {EmBower};