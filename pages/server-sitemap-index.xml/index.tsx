import { getServerSideSitemap, ISitemapField } from "next-sitemap";
import { GetServerSideProps } from "next";
import { getSnippetUrl } from "lib/snippets";

const SITE_URL = process.env.NEXT_PUBLIC_SITEMAP_URL || "";
const ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_API || "";

const QUERY_PUBLIC_ASSISTANT_DATA_COUNT = `{
  assistantPublicRecipesCount
}`;

const assistantPublicDataQuery = (
  howmanyRecipes: number
) => `query assistantPublicData {
  assistantPublicRecipes(howmany: ${howmanyRecipes}, skip: 0){
    id
    name
    language
  }
}
`;

async function fetchPublicAssistantDataCount(): Promise<{
  assistantPublicRecipesCount: number;
}> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: QUERY_PUBLIC_ASSISTANT_DATA_COUNT,
      }),
    });

    if (response.ok) {
      const json = await response.json();

      return json.data;
    }

    return {
      assistantPublicRecipesCount: 0,
    };
  } catch (err) {
    return {
      assistantPublicRecipesCount: 0,
    };
  }
}

async function fetchPublicAssistantData(howmanyRecipes: number): Promise<{
  assistantPublicRecipes: { id: number; name: string }[];
}> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: assistantPublicDataQuery(howmanyRecipes),
      }),
    });

    if (response.ok) {
      const json = await response.json();

      return json.data;
    }

    return { assistantPublicRecipes: [] };
  } catch (err) {
    return { assistantPublicRecipes: [] };
  }
}

function getRecipesPaths(recipes: { id: number; name: string }[]): string[] {
  return recipes.map((recipe) => {
    const url = getSnippetUrl(recipe);
    return `${SITE_URL}${url}`;
  });
}

async function getSitemap() {
  const result: ISitemapField[] = [];

  const { assistantPublicRecipesCount } = await fetchPublicAssistantDataCount();

  const { assistantPublicRecipes } = await fetchPublicAssistantData(
    assistantPublicRecipesCount
  );

  const recipesPaths = getRecipesPaths(assistantPublicRecipes);

  recipesPaths.forEach((path) => {
    result.push({
      loc: path,
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    });
  });

  return result;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const urls = await getSitemap();

  return getServerSideSitemap(ctx, urls);
};

export default function Sitemap() {}
