import React, { useEffect, useState } from "react";
import { Container, Table, Thead, Tbody, Tr, Th, Td, VStack, Text, Spinner, Link } from "@chakra-ui/react";
import { FaExternalLinkAlt } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
        const storyIds = await response.json();
        const top10StoryIds = storyIds.slice(0, 10);

        const storyPromises = top10StoryIds.map(async (id) => {
          const storyResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyResponse.json();
        });

        const stories = await Promise.all(storyPromises);
        setStories(stories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <Container centerContent maxW="container.lg" py={8}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold">
          Hacker News Top Stories
        </Text>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Score</Th>
                <Th>Link</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stories.map((story) => (
                <Tr key={story.id}>
                  <Td>{story.title}</Td>
                  <Td>{story.by}</Td>
                  <Td>{story.score}</Td>
                  <Td>
                    <Link href={story.url} isExternal>
                      <FaExternalLinkAlt />
                    </Link>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
