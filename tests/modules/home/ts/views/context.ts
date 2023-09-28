import * as React from 'react';
import type { Store } from '../store';

export interface IContext {
	selected?: Set<any>;
	onCheck?: (event) => void;
	store: Store;
	total: number;
	totalSelected: number;
}
export const TestContext = React.createContext({} as IContext);
export const useTestContext = () => React.useContext(TestContext);
