import { Box, ButtonGroup, IconButton, Text } from "@chakra-ui/react";
import CardsIcon from "components/shared/icons/CardsIcon";
import ListIcon from "components/shared/icons/ListIcon";
import LanguagePicker from "components/shared/language-picker/LanguagePicker";
import { useSearchResultsContext } from "contexts/SearchResulstsProvider";
import { useRouter } from "next/router";
import { Language } from "types/Language";
import { View } from "types/Search";

const ResultsFilters = () => {
  const { pathname, query, push } = useRouter();

  const { view, language } = useSearchResultsContext();

  const handleView = (value: View) => {
    push({ query: { ...query, view: value }, pathname });
  };

  const handleLanguage = (value: Language | null) => {
    if (value) {
      push({ query: { ...query, lang: value }, pathname });
    } else {
      const { lang, ...queryWithoutLang } = query;
      push({ query: { ...queryWithoutLang }, pathname });
    }
  };

  return (
    <Box d="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box d="flex" gap={4} alignItems="center">
        <LanguagePicker value={language} onChange={handleLanguage} />
        {view === "list" && (
          <Text fontSize="sm">&uarr;&darr; Use arrows to navigate</Text>
        )}
      </Box>
      <ButtonGroup
        isAttached
        variant="outline"
        size="xs"
        d={{ base: "none", md: "block" }}
      >
        <IconButton
          aria-label="List view"
          icon={<ListIcon color={view === "list" ? "#23A9F2" : ""} />}
          onClick={() => handleView("list")}
        />
        <IconButton
          aria-label="Cards view"
          icon={<CardsIcon color={view === "cards" ? "#23A9F2" : ""} />}
          onClick={() => handleView("cards")}
        />
      </ButtonGroup>
    </Box>
  );
};

export default ResultsFilters;
