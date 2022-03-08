import {
  Box,
  BoxProps,
  Button,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useRecipeContext } from "contexts/RecipeProvider";
import { decodeIndent } from "lib/decodeIndent";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import RecipeShare from "./RecipeShare";

type RecipeCodeProps = BoxProps & {
  removeScroll?: boolean;
};

const RecipeCode = ({ removeScroll = false, ...props }: RecipeCodeProps) => {
  const [loaded, setLoaded] = useState(false);
  const { code, language } = useRecipeContext() || {};
  const bg = useColorModeValue("white", "brand.500");
  const toast = useToast();

  const decoded = decodeIndent(code);

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(decoded);
      toast({
        title: "Snippet copied.",
        description: "Paste the snippet in your IDE.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Something went wrong.",
        description: "Sorry we couldn't copy the snippet.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  useEffect(() => {
    // attempt to highlight
    // on mount if prism is alredy loaded
    // once prism is loaded
    // when language change (data is fetched)
    if ((window as any).Prism) {
      (window as any).Prism?.highlightAll();
    }
  }, [language, loaded]);

  if (!language) return null;

  return (
    <Box
      w="100%"
      bg={bg}
      overflow={removeScroll ? "hidden" : "auto"}
      d="flex"
      justifyContent="flex-end"
      {...props}
    >
      <Box w="100%" pos="relative" overflow={removeScroll ? "hidden" : "auto"}>
        <HStack
          mt={2}
          mx={4}
          spacing={2}
          justifyContent="flex-end"
          top={2}
          position="sticky"
          zIndex={1}
        >
          <RecipeShare />
          <Button variant="share" size="sm" onClick={copyToClipboard}>
            Copy Snippet
          </Button>
        </HStack>
        <Box as="pre" w="100%" overflow={removeScroll ? "hidden" : "auto"}>
          <code className={`lang-${language?.toLowerCase()}`}>{decoded}</code>
        </Box>
      </Box>
      <Script src="/prism.js" onLoad={handleLoad} />
    </Box>
  );
};

export default RecipeCode;