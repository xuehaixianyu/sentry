import styled from '@emotion/styled';

import {ProfileInterface} from 'sentry/components/events/interfaces/profiles';
import * as Layout from 'sentry/components/layouts/thirds';
import {FlamegraphPreferencesProvider} from 'sentry/utils/profiling/flamegraph/flamegraphPreferencesProvider';
import {FlamegraphThemeProvider} from 'sentry/utils/profiling/flamegraph/flamegraphThemeProvider';
import {ProfileGroup} from 'sentry/utils/profiling/profile/importProfile';

interface ProfilingDetailsProps {
  profileGroup: ProfileGroup;
}

function ProfilingDetailsContent({profileGroup}: ProfilingDetailsProps) {
  return (
    <FlamegraphPreferencesProvider>
      <FlamegraphThemeProvider>
        <Layout.Header>
          <Layout.HeaderContent>
            <Layout.Title data-test-id="profile-header">{profileGroup.name}</Layout.Title>
          </Layout.HeaderContent>
        </Layout.Header>
        <Body>
          <Layout.Main fullWidth>
            stuff
            <ProfileInterface profileGroup={profileGroup} />
          </Layout.Main>
        </Body>
      </FlamegraphThemeProvider>
    </FlamegraphPreferencesProvider>
  );
}

const Body = styled(Layout.Body)`
  padding: 0;

  @media (min-width: ${p => p.theme.breakpoints[1]}) {
    padding: 0;
  }
`;

export {ProfilingDetailsContent};
