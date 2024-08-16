import React from 'react';
import type { Store } from '../store';

export interface IContext {}
export const ModuleContext = React.createContext({} as IContext);
export const useModuleContext = () => React.useContext(ModuleContext);
