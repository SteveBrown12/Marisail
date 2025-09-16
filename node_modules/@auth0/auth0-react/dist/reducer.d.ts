import { User } from '@auth0/auth0-spa-js';
import { AuthState } from './auth-state';
type Action = {
    type: 'LOGIN_POPUP_STARTED';
} | {
    type: 'INITIALISED' | 'LOGIN_POPUP_COMPLETE' | 'GET_ACCESS_TOKEN_COMPLETE' | 'HANDLE_REDIRECT_COMPLETE';
    user: User | undefined;
} | {
    type: 'LOGOUT';
} | {
    type: 'ERROR';
    error: Error;
};
/**
 * Handles how that state changes in the `useAuth0` hook.
 */
export declare const reducer: <TUser extends User = User>(state: AuthState<TUser>, action: Action) => AuthState<TUser>;
export {};
//# sourceMappingURL=reducer.d.ts.map