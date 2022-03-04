import styled from '@emotion/styled';

import {ProfileGroup} from 'sentry/utils/profiling/profile/importProfile';

import {ProfileThreadSelector} from './profileThreadSelector';

interface ProfileTitleProps {
  onThreadChange: (index: number) => void;
  profileGroup: ProfileGroup;
  title: string;
}

function ProfileTitle({onThreadChange, profileGroup, title}: ProfileTitleProps) {
  return (
    <Wrapper>
      <StyledH3>
        {title}
        <small>
          <ThreadSelectorWrapper>
            <ProfileThreadSelector
              onThreadChange={onThreadChange}
              profileGroup={profileGroup}
            />
          </ThreadSelectorWrapper>
        </small>
      </StyledH3>
    </Wrapper>
  );
}

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  flex-grow: 1;
  justify-content: flex-start;
`;

const StyledH3 = styled('h3')`
  margin-bottom: 0;
  max-width: 100%;
  white-space: nowrap;
`;

const ThreadSelectorWrapper = styled('span')`
  white-space: normal;
`;

export {ProfileTitle};
