import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Express } from 'express';
import puppeteer, { type Browser, type ConsoleMessage, type LaunchOptions } from 'puppeteer';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const require = createRequire(import.meta.url);
const express: typeof import('express') = require('express');
const vitePrerender = require('vite-plugin-prerender');

const basePath = '/omni-color';
const currentDir = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.resolve(currentDir, 'dist');
const prerenderRoutes = [`${basePath}/`, `${basePath}/playground`];

interface RendererOptions extends LaunchOptions {
  renderAfterElementExists?: string;
  renderAfterTime?: number;
  headless?: boolean;
  consoleHandler?: (route: string, message: ConsoleMessage) => void;
}

class ModernPuppeteerRenderer {
  private browser: Browser | null = null;
  private options: RendererOptions;

  constructor(options: RendererOptions) {
    this.options = options;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: puppeteer.executablePath(),
      ...this.options,
    });
  }

  async renderRoutes(
    routes: string[],
    prerenderer: { getOptions: () => { server: { host: string; port: number } } }
  ) {
    if (!this.browser) {
      throw new Error('Renderer is not initialized.');
    }

    const { server } = prerenderer.getOptions();
    const host = `http://${server.host}:${server.port}`;

    const renderedRoutes = [];
    for (const route of routes) {
      const page = await this.browser.newPage();
      if (this.options.consoleHandler) {
        page.on('console', (message) => {
          this.options.consoleHandler?.(route, message);
        });
      }

      await page.goto(`${host}${route}`, { waitUntil: 'networkidle0' });

      if (this.options.renderAfterElementExists) {
        await page.waitForSelector(this.options.renderAfterElementExists);
      }

      if (this.options.renderAfterTime) {
        await new Promise((resolve) => {
          setTimeout(resolve, this.options.renderAfterTime);
        });
      }

      const html = await page.content();
      renderedRoutes.push({
        originalRoute: route,
        route,
        html,
      });

      await page.close();
    }

    return renderedRoutes;
  }

  async destroy() {
    await this.browser?.close();
  }

  modifyServer(
    prerenderer: { getOptions: () => { staticDir: string } },
    serverInstance: { _expressServer: Express },
    stage: string
  ) {
    if (stage === 'post-static') {
      const { staticDir: prerenderStaticDir } = prerenderer.getOptions();
      serverInstance._expressServer.use(
        basePath,
        express.static(prerenderStaticDir, { dotfiles: 'allow' })
      );
    }
  }
}

const prerenderRenderer = new ModernPuppeteerRenderer({
  renderAfterElementExists: 'h1',
  renderAfterTime: 500,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  consoleHandler(route, message) {
    if (message.type() === 'error') {
      console.error(`[prerender][${route}] ${message.type()}: ${message.text()}`);
    }
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    vitePrerender({
      staticDir,
      routes: prerenderRoutes,
      server: {
        host: 'localhost',
      },
      indexPath: path.resolve(staticDir, 'index.html'),
      renderer: prerenderRenderer,
      postProcess(renderedRoute: { route: string; [key: string]: unknown }) {
        const normalizedBase = basePath.replace(/\/$/, '');
        if (renderedRoute.route === normalizedBase || renderedRoute.route === `${normalizedBase}/`) {
          renderedRoute.route = '/';
        } else if (renderedRoute.route.startsWith(`${normalizedBase}/`)) {
          renderedRoute.route = renderedRoute.route.slice(normalizedBase.length) || '/';
        }

        return renderedRoute;
      },
    }),
  ],
  base: basePath,
});
