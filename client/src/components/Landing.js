import { Box, Button, Heading, Text, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => (
  <Box as="section">
    <Box
      maxW="2xl"
      mx="auto"
      px={{ base: '6', lg: '8' }}
      py={{ base: '16', sm: '20' }}
      textAlign="center"
    >
      <Heading as="h2" size="3xl" fontWeight="extrabold" letterSpacing="tight">
        Welcome to
        <br />
        Posty App
      </Heading>
      <Text mt="4" fontSize="lg">
        Log in and start your first posty
      </Text>
      <Flex justify="center" mt="8">
        <Button
          mr="2"
          as="a"
          href="#"
          size="lg"
          colorScheme="teal"
          fontWeight="bold"
        >
          <Link to="/register">Sign Up</Link>
        </Button>
        <Button
          ml="2"
          as="a"
          href="#"
          size="lg"
          colorScheme="teal"
          fontWeight="bold"
          variant="outline"
        >
          <Link to="/login">Login</Link>
        </Button>
      </Flex>
    </Box>
  </Box>
);

export default Landing;
