import {useEffect, useState} from 'react';
import {RouteComponentProps} from 'react-router';

import {Client} from 'sentry/api';
import Alert from 'sentry/components/alert';
import LoadingIndicator from 'sentry/components/loadingIndicator';
import NoProjectMessage from 'sentry/components/noProjectMessage';
import SentryDocumentTitle from 'sentry/components/sentryDocumentTitle';
import {IconFlag} from 'sentry/icons';
import {t} from 'sentry/locale';
import {PageContent} from 'sentry/styles/organization';
import {Organization, Project} from 'sentry/types';
import {Trace} from 'sentry/types/profiling/core';
import {defined} from 'sentry/utils';
import {importProfile, ProfileGroup} from 'sentry/utils/profiling/profile/importProfile';
import useApi from 'sentry/utils/useApi';
import useOrganization from 'sentry/utils/useOrganization';

import {ProfilingDetailsContent} from './content';

type RequestState = 'initial' | 'loading' | 'resolved' | 'errored';

type Params = {
  eventId: Trace['id'];
  projectId: Project['slug'];
};

interface ProfileDetailsProps extends RouteComponentProps<Params, {}> {}

function ProfilingDetails({params}: ProfileDetailsProps) {
  const api = useApi();
  const organization = useOrganization();
  const [profile, setProfile] = useState<ProfileGroup | null>(null);
  const [requestState, setRequestState] = useState<RequestState>('initial');

  useEffect(() => {
    if (!params.eventId || !params.projectId) {
      return;
    }

    api.clear();
    setRequestState('loading');

    fetchFlamegraphs(api, params.eventId, params.projectId, organization)
      .then(importedFlamegraphs => {
        setProfile(importedFlamegraphs);
        setRequestState('resolved');
      })
      .catch(() => setRequestState('errored'));
  }, [api, organization, params.eventId]);

  return (
    <SentryDocumentTitle
      title={t('Profiling Details')}
      orgSlug={organization.slug}
      projectSlug={params.projectId}
    >
      <PageContent noPadding>
        <NoProjectMessage organization={organization}>
          {requestState === 'errored' ? (
            <Alert type="error" icon={<IconFlag size="md" />}>
              {t('Unable to load profiles')}
            </Alert>
          ) : requestState === 'loading' ? (
            <LoadingIndicator />
          ) : requestState === 'resolved' && defined(profile) ? (
            <ProfilingDetailsContent profileGroup={profile} />
          ) : null}
        </NoProjectMessage>
      </PageContent>
    </SentryDocumentTitle>
  );
}

function fetchFlamegraphs(
  api: Client,
  eventId: string,
  projectId: Project['id'],
  organization: Organization
): Promise<ProfileGroup> {
  return api
    .requestPromise(
      `/projects/${organization.slug}/${projectId}/profiling/profiles/${eventId}/`,
      {
        method: 'GET',
        includeAllArgs: true,
      }
    )
    .then(([data]) => importProfile(data, eventId));
}

export default ProfilingDetails;
