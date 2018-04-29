/**
 * Exports all components that are used in the dynamic router. They must
 * be defined here to allow for the String name to be transformed into
 * an Object.
 *
 * See http://stackoverflow.com/questions/38902704/dynamically-define-reactjs-routes-from-json
 * for more reasoning on this design choice.
 */

import Dashboard from './Views/Dashboard.js';
 
export * from './Views/SampleReact.js';
export { Dashboard };

