import {useMemo, useState} from 'react';
import styled from '@emotion/styled';

import Button from 'sentry/components/button';
import EventDataSection from 'sentry/components/events/eventDataSection';
import {Panel} from 'sentry/components/panels';
import {FlamegraphZoomView} from 'sentry/components/profiling/flamegraphZoomView';
import {FlamegraphZoomViewMinimap} from 'sentry/components/profiling/flamegraphZoomViewMinimap';
import {t} from 'sentry/locale';
import space from 'sentry/styles/space';
import {CanvasPoolManager} from 'sentry/utils/profiling/canvasScheduler';
import {Flamegraph} from 'sentry/utils/profiling/flamegraph';
import {FlamegraphTheme} from 'sentry/utils/profiling/flamegraph/flamegraphTheme';
import {useFlamegraphPreferences} from 'sentry/utils/profiling/flamegraph/useFlamegraphPreferences';
import {useFlamegraphTheme} from 'sentry/utils/profiling/flamegraph/useFlamegraphTheme';
import {ProfileGroup} from 'sentry/utils/profiling/profile/importProfile';

import {ProfilePreferenceMenu} from './profilePreferenceMenu';
import {ProfileSearch} from './profileSearch';
import {ProfileTitle} from './profileTitle';

interface ProfileInterfaceProps {
  profileGroup: ProfileGroup;
}

function ProfileInterface({profileGroup}: ProfileInterfaceProps) {
  const canvasPoolManager = useMemo(() => new CanvasPoolManager(), []);
  const [activeProfileIndex, setActiveProfileIndex] = useState<number>(
    profileGroup.activeProfileIndex
  );
  const [{colorCoding, sorting, view}, dispatch] = useFlamegraphPreferences();
  const flamegraphTheme = useFlamegraphTheme();

  const flamegraph = useMemo(
    () =>
      new Flamegraph(profileGroup.profiles[activeProfileIndex], activeProfileIndex, {
        inverted: view === 'bottom up',
        leftHeavy: sorting === 'left heavy',
      }),
    [profileGroup, activeProfileIndex, view, sorting]
  );

  return (
    <EventDataSection
      type="profile"
      title={
        <ProfileTitle
          title={t('Profile')}
          profileGroup={profileGroup}
          onThreadChange={setActiveProfileIndex}
        />
      }
      wrapTitle={false}
      // TODO: the thread selector needs to somehow
      // stop the click from propagating to the anchor
      actions={
        <ProfilePreferenceMenu
          colorCoding={colorCoding}
          sorting={sorting}
          view={view}
          onColorCodingChange={c => {
            dispatch({type: 'set color coding', value: c});
          }}
          onSortingChange={s => {
            dispatch({type: 'set sorting', value: s});
          }}
          onViewChange={v => {
            dispatch({type: 'set view', value: v});
          }}
        />
      }
    >
      <FlamegraphOptionsContainer>
        <ProfileSearch flamegraphs={flamegraph} canvasPoolManager={canvasPoolManager} />
        <Button onClick={() => canvasPoolManager.dispatch('resetZoom', [])}>
          {t('Reset Zoom')}
        </Button>
      </FlamegraphOptionsContainer>
      <Panel>
        <FlamegraphZoomViewMinimapContainer height={flamegraphTheme.SIZES.MINIMAP_HEIGHT}>
          <FlamegraphZoomViewMinimap
            flamegraph={flamegraph}
            canvasPoolManager={canvasPoolManager}
          />
        </FlamegraphZoomViewMinimapContainer>
        <FlamegraphZoomViewContainer>
          <FlamegraphZoomView
            flamegraph={flamegraph}
            canvasPoolManager={canvasPoolManager}
          />
        </FlamegraphZoomViewContainer>
      </Panel>
    </EventDataSection>
  );
}

const FlamegraphZoomViewMinimapContainer = styled('div')<{
  height: FlamegraphTheme['SIZES']['MINIMAP_HEIGHT'];
}>`
  position: relative;
  height: ${p => p.height}px;
  flex-shrink: 0;
`;

const FlamegraphZoomViewContainer = styled('div')`
  position: relative;
  flex: 1 1 100%;
  height: 50vh;
`;

const FlamegraphOptionsContainer = styled('div')`
  display: flex;
  flex-direction: row;
  gap: ${space(0.5)};
  justify-content: space-between;
  margin-bottom: ${space(1)};
`;

export {ProfileInterface};
