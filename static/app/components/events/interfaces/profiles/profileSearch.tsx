import {useEffect, useMemo, useState} from 'react';
import styled from '@emotion/styled';
import * as Sentry from '@sentry/react';
import type Fuse from 'fuse.js';

import SearchBar from 'sentry/components/searchBar';
import {t} from 'sentry/locale';
import {createFuzzySearch} from 'sentry/utils/fuzzySearch';
import {CanvasPoolManager} from 'sentry/utils/profiling/canvasScheduler';
import {Flamegraph} from 'sentry/utils/profiling/flamegraph';
import {FlamegraphFrame} from 'sentry/utils/profiling/flamegraphFrame';
import {isRegExpString, parseRegExp} from 'sentry/utils/profiling/validators/regExp';

interface ProfileSearchProps {
  canvasPoolManager: CanvasPoolManager;
  flamegraphs: Flamegraph | Flamegraph[];
}

function ProfileSearch({canvasPoolManager, flamegraphs}: ProfileSearchProps) {
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
  // const [selectedNode, setSelectedNode] = useState<FlamegraphFrame | null>();
  // const [searchResults, setSearchResults] = useState<Record<string, FlamegraphFrame>>({});

  const allFrames = useMemo(() => {
    if (Array.isArray(flamegraphs)) {
      return flamegraphs.reduce(
        (acc: FlamegraphFrame[], graph) => acc.concat(graph.frames),
        []
      );
    }

    return flamegraphs.frames;
  }, [flamegraphs]);

  const [searchIndex, setSearchIndex] = useState<Fuse<FlamegraphFrame> | null>(null);

  useEffect(() => {
    createFuzzySearch(allFrames, {
      keys: ['frame.name'],
      threshold: 0.3,
      includeMatches: true,
    }).then(fuse => setSearchIndex(fuse));
  }, [allFrames]);

  useEffect(() => {
    if (!searchIndex) {
      return;
    }

    if (!searchQuery) {
      canvasPoolManager.dispatch('searchResults', [{}]);
      return;
    }

    const results = frameSearch(searchQuery, allFrames, searchIndex);

    canvasPoolManager.dispatch('searchResults', [results]);
  }, [searchQuery, searchIndex, frames, canvasPoolManager, allFrames]);

  return (
    <StyledSearchBar
      defaultQuery=""
      query={searchQuery || ''}
      placeholder={t('Search for functions')}
      onSearch={setSearchQuery}
      onChange={setSearchQuery}
    />
  );
}

function frameSearch(
  query: string,
  frames: ReadonlyArray<FlamegraphFrame>,
  index: Fuse<FlamegraphFrame>
): Record<string, FlamegraphFrame> {
  const results = {};
  if (isRegExpString(query)) {
    const [_, lookup, flags] = parseRegExp(query) ?? [];

    try {
      if (!lookup) {
        throw new Error('Invalid RegExp');
      }

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];

        if (new RegExp(lookup, flags ?? 'g').test(frame.frame.name.trim())) {
          results[
            `${
              frame.frame.name +
              (frame.frame.file ? frame.frame.file : '') +
              String(frame.start)
            }`
          ] = frame;
        }
      }
    } catch (e) {
      Sentry.captureMessage(e.message);
    }

    return results;
  }

  const fuseResults = index
    .search(query)
    .sort((a, b) => numericSort(a.item.start, b.item.start, 'asc'));

  for (let i = 0; i < fuseResults.length; i++) {
    const frame = fuseResults[i];

    results[
      `${
        frame.item.frame.name +
        (frame.item.frame.file ? frame.item.frame.file : '') +
        String(frame.item.start)
      }`
    ] = frame.item;
  }

  return results;
}

const numericSort = (
  a: null | undefined | number,
  b: null | undefined | number,
  direction: 'asc' | 'desc'
): number => {
  if (a === b) {
    return 0;
  }
  if (a === null || a === undefined) {
    return 1;
  }
  if (b === null || b === undefined) {
    return -1;
  }

  return direction === 'asc' ? a - b : b - a;
};

const StyledSearchBar = styled(SearchBar)`
  flex-grow: 1;
`;

export {ProfileSearch};
