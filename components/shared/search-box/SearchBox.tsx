import { KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { useCombobox } from "downshift";
import useSnippetsSummary from "hooks/useSnippetsSummary";
import { RecipeSummary } from "types/Recipe";
import {
  Box,
  IconButton,
  Input,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import SearchBoxOption from "./SerachBoxOption";
import { useRouter } from "next/router";
import { CloseIcon, Search2Icon } from "@chakra-ui/icons";
import BeatLoader from "react-spinners/BeatLoader";
import { css } from "@emotion/react";
import NextLink from "next/link";
import debounce from "lodash/debounce";
import { getSnippetUrl } from "lib/snippets";

const HOWMANY = 6;
const SKIP = 0;
// const ORDER_BY = RecipeSortingFields.Name;
// const DESC = true;

type SearchBoxProps = {
  autoFocus?: boolean;
  withQuery?: boolean;
};

const SearchBox = ({
  autoFocus = false,
  withQuery = false,
}: SearchBoxProps) => {
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputItems, setInputItems] = useState<RecipeSummary[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchSnippetsSummary = useSnippetsSummary();

  const bg = useColorModeValue("white", "#282C34");
  const loader = useColorModeValue("#718096", "white");
  const inputBg = useColorModeValue("white", "#21252B");
  const iconColor = useColorModeValue("gray.500", "white");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedInputChange = useCallback(
    debounce(async ({ inputValue }) => {
      if (!inputValue) {
        setError(false);
        setInputItems([]);
        return;
      }

      setLoading(true);

      const { data, error: fetchError } = await fetchSnippetsSummary({
        variables: {
          term: inputValue,
          howmany: HOWMANY,
          skip: SKIP,
          onlyPublic: true,
          // orderBy: ORDER_BY,
          // desc: DESC,
        },
      });

      console.log({data});

      setLoading(false);

      if (fetchError) {
        setError(true);
        setInputItems([]);
        return;
      }

      setInputItems(data?.assistantRecipesSemanticSearch || []);
    }, 300),
    []
  );

  const {
    isOpen,
    inputValue,
    highlightedIndex,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    reset,
    openMenu,
  } = useCombobox({
    id: `search-box`,
    items: inputItems,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        push(getSnippetUrl(selectedItem));
      }
    },
    onInputValueChange: debouncedInputChange,
  });

  const handleSearch = () => {
    const query = `?q=${inputValue}`;
    push(`/search${inputValue ? query : ""}`);
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    const { code } = event;

    if (code === "Enter" && inputValue && highlightedIndex === -1) {
      handleSearch();
    }
  };

  const handleFocus = () => {
    if (!isOpen) {
      openMenu();
    }
  };

  const handleClear = () => {
    reset();
    inputRef.current?.focus();
  };

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box pos="relative" maxW={590} mx="auto" flexGrow={2}>
      <Box
        position="relative"
        d="flex"
        alignItems="center"
        {...getComboboxProps()}
      >
        <Input
          bg={inputBg}
          borderRadius={4}
          border="none"
          shadow="base"
          {...getInputProps({
            ref: inputRef,
            onKeyDown: handleEnter,
            onFocus: handleFocus,
          })}
        />
        {loading && (
          <BeatLoader
            color={loader}
            css={css`
              position: absolute;
              right: 40px;
              z-index: 1;
            `}
            size={8}
          />
        )}
        {inputValue && !loading && (
          <IconButton
            position="absolute"
            right={10}
            zIndex={1}
            aria-label="Clear Search"
            variant="ghost"
            size="xs"
            icon={<CloseIcon color={iconColor} />}
            onClick={handleClear}
          />
        )}
        <IconButton
          position="absolute"
          right={0}
          zIndex={1}
          aria-label="Search"
          variant="ghost"
          color="#131126"
          size="md"
          icon={<Search2Icon color={iconColor} />}
          onClick={handleSearch}
        />
      </Box>
      <Box
        as="ul"
        listStyleType="none"
        borderRadius="base"
        pos="absolute"
        zIndex={100}
        mt={2}
        w="100%"
        bg={bg}
        shadow="lg"
        overflow="hidden"
        {...getMenuProps()}
      >
        {isOpen && inputItems.length > 0 && (
          <>
            {inputItems.map((item, index) => (
              <li
                key={item.id}
                {...getItemProps({
                  item,
                  index,
                })}
              >
                <SearchBoxOption
                  selected={highlightedIndex === index}
                  {...item}
                />
              </li>
            ))}
            <li>
              <NextLink href={`/search?q=${inputValue}`} passHref>
                <Link p={3} w="100%" d="block" textAlign="center">
                  View all
                </Link>
              </NextLink>
            </li>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchBox;