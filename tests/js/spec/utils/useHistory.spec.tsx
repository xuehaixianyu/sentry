import {createMemoryHistory, Route, Router, RouterContext} from 'react-router';

import {render} from 'sentry-test/reactTestingLibrary';

import useHistory from 'sentry/utils/useHistory';
import {RouteContext} from 'sentry/views/routeContext';

describe('useHistory', () => {
  it('returns the history object', function () {
    let history;
    function HomePage() {
      history = useHistory();
      return null;
    }

    const memoryHistory = createMemoryHistory();
    memoryHistory.push('/');

    render(
      <Router
        history={memoryHistory}
        render={props => {
          return (
            <RouteContext.Provider value={props}>
              <RouterContext {...props} />
            </RouteContext.Provider>
          );
        }}
      >
        <Route path="/" component={HomePage} />
      </Router>
    );

    expect(typeof history).toBe('object');
    expect(typeof history.push).toBe('function');
  });
});
