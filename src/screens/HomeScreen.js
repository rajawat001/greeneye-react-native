// src/screens/HomeScreen.js
import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import Hero from '../components/Hero';
import About from '../components/About';
import BlogIndex from '../components/BlogIndex';
import Donate from '../components/Donate';
import Volunteer from '../components/Volunteer';
import Programs from '../components/Programs';
import Impact from '../components/Impact';
import Contact from '../components/Contact';

export default function HomeScreen() {
  const { t } = useTranslation('home');

  return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Hero />
        <About />
        <BlogIndex />
        <Donate />
        <Volunteer />
        <Programs />
        <Impact />
        <Contact />
      </ScrollView>
  );
}