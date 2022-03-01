import * as React from 'react';
import {ClassNames} from '@emotion/react';
import styled from '@emotion/styled';

import GuideAnchor from 'sentry/components/assistant/guideAnchor';
import DatePageFilter from 'sentry/components/datePageFilter';
import EnvironmentPageFilter from 'sentry/components/environmentPageFilter';
import PageFiltersBar from 'sentry/components/organizations/pageFiltersBar';
import ProjectPageFilter from 'sentry/components/projectPageFilter';
import {IconSort} from 'sentry/icons/iconSort';
import {IconStack} from 'sentry/icons/iconStack';
import ProjectsStore from 'sentry/stores/projectsStore';
import space from 'sentry/styles/space';
import {Organization, SavedSearch} from 'sentry/types';

import IssueListDisplayOptions from './displayOptions';
import IssueListSearchBar from './searchBar';
import IssueListSortOptions from './sortOptions';
import {TagValueLoader} from './types';
import {IssueDisplayOptions} from './utils';

type IssueListSearchBarProps = React.ComponentProps<typeof IssueListSearchBar>;

type Props = {
  display: IssueDisplayOptions;
  isSearchDisabled: boolean;
  onDisplayChange: (display: string) => void;
  onSearch: (query: string) => void;
  onSidebarToggle: (event: React.MouseEvent) => void;
  onSortChange: (sort: string) => void;
  organization: Organization;

  query: string;
  queryCount: number;
  savedSearch: SavedSearch;
  selectedProjects: number[];
  sort: string;
  tagValueLoader: TagValueLoader;
  tags: NonNullable<IssueListSearchBarProps['supportedTags']>;
};

class IssueListFilters extends React.Component<Props> {
  render() {
    const {
      organization,
      savedSearch,
      query,
      queryCount,
      isSearchDisabled,
      sort,
      display,
      selectedProjects,

      onSidebarToggle,
      onSearch,
      onSortChange,
      onDisplayChange,
      tagValueLoader,
      tags,
    } = this.props;
    const isAssignedQuery = /\bassigned:/.test(query);
    const hasIssuePercentDisplay = organization.features.includes(
      'issue-percent-display'
    );
    const hasMultipleProjectsSelected =
      !selectedProjects || selectedProjects.length !== 1 || selectedProjects[0] === -1;
    const hasSessions =
      !hasMultipleProjectsSelected &&
      (ProjectsStore.getById(`${selectedProjects[0]}`)?.hasSessions ?? false);
    const hasPageFilters = organization.features.includes('selection-filters-v2');

    return (
      <FilterContainer>
        <SearchContainer
          hasPageFilters={hasPageFilters}
          hasIssuePercentDisplay={hasIssuePercentDisplay}
        >
          <ClassNames>
            {({css}) => (
              <GuideAnchor
                target="assigned_or_suggested_query"
                disabled={!isAssignedQuery}
                containerClassName={css`
                  width: 100%;
                `}
              >
                <StyledSearchBar
                  organization={organization}
                  query={query || ''}
                  sort={sort}
                  onSearch={onSearch}
                  disabled={isSearchDisabled}
                  excludeEnvironment
                  supportedTags={tags}
                  tagValueLoader={tagValueLoader}
                  savedSearch={savedSearch}
                  onSidebarToggle={onSidebarToggle}
                />
              </GuideAnchor>
            )}
          </ClassNames>

          {hasPageFilters ? (
            <StyledPageFiltersBar>
              <ProjectPageFilter borderless />
              <EnvironmentPageFilter borderless />
              <DatePageFilter borderless hidePin />
            </StyledPageFiltersBar>
          ) : (
            <DropdownsWrapper hasIssuePercentDisplay={hasIssuePercentDisplay}>
              {hasIssuePercentDisplay && (
                <IssueListDisplayOptions
                  onDisplayChange={onDisplayChange}
                  display={display}
                  hasMultipleProjectsSelected={hasMultipleProjectsSelected}
                  hasSessions={hasSessions}
                />
              )}
              <IssueListSortOptions sort={sort} query={query} onSelect={onSortChange} />
            </DropdownsWrapper>
          )}
        </SearchContainer>
        {hasPageFilters && queryCount > 0 && (
          <ResultsRow>
            <QueryCount>{queryCount} results found</QueryCount>
            <PageFiltersBar>
              {hasIssuePercentDisplay && (
                <IssueListDisplayOptions
                  onDisplayChange={onDisplayChange}
                  display={display}
                  hasMultipleProjectsSelected={hasMultipleProjectsSelected}
                  hasSessions={hasSessions}
                  buttonProps={{
                    prefix: undefined,
                    borderless: true,
                    icon: <IconStack size="sm" />,
                    size: 'small',
                  }}
                />
              )}
              <IssueListSortOptions
                sort={sort}
                query={query}
                onSelect={onSortChange}
                buttonProps={{
                  prefix: undefined,
                  borderless: true,
                  icon: <IconSort size="sm" />,
                  size: 'small',
                }}
              />
            </PageFiltersBar>
          </ResultsRow>
        )}
      </FilterContainer>
    );
  }
}

const FilterContainer = styled('div')`
  margin-bottom: ${space(1)};
`;

const SearchContainer = styled('div')<{
  hasIssuePercentDisplay?: boolean;
  hasPageFilters?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-bottom: ${space(2)};

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    flex-wrap: wrap;
  }
`;

const StyledSearchBar = styled(IssueListSearchBar)`
  width: 100%;
`;

const StyledPageFiltersBar = styled(PageFiltersBar)`
  width: 28rem;
  margin-left: ${space(1)};

  & > * {
    flex: 1 1 50%;
  }

  @media (max-width: ${p => p.theme.breakpoints[2]}) {
    width: 24rem;
  }

  @media (max-width: ${p => p.theme.breakpoints[1]}) {
    width: 20rem;
  }

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    margin-left: ${space(0)};
    margin-top: ${space(1)};
    width: 100%;
  }
`;

const DropdownsWrapper = styled('div')<{hasIssuePercentDisplay?: boolean}>`
  display: grid;
  gap: ${space(1)};
  grid-template-columns: 1fr ${p => (p.hasIssuePercentDisplay ? '1fr' : '')};
  align-items: start;
  margin-left: ${space(1)};

  @media (max-width: ${p => p.theme.breakpoints[0]}) {
    grid-template-columns: 1fr;
  }
`;

const QueryCount = styled('p')`
  font-size: ${p => p.theme.fontSizeLarge};
  font-weight: 600;
  color: ${p => p.theme.headingColor};
  margin-bottom: 0;
`;

const ResultsRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default IssueListFilters;
