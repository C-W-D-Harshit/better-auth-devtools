import { HOME_PAGE, REQUIREMENTS, SITE, plainText } from "./site-content"

const WEBSITE_ID = `${SITE.url}/#website`
const SOFTWARE_ID = `${SITE.url}/#software`
const AUTHOR_ID = `${SITE.url}/#author`

export function buildStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        publisher: { "@id": AUTHOR_ID },
      },
      {
        "@type": "Person",
        "@id": AUTHOR_ID,
        name: SITE.author.name,
        url: SITE.author.url,
        sameAs: [SITE.author.url, SITE.author.xUrl],
      },
      {
        "@type": ["SoftwareApplication", "SoftwareSourceCode"],
        "@id": SOFTWARE_ID,
        name: SITE.name,
        alternateName: SITE.packageName,
        description: SITE.description,
        url: SITE.url,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Authentication developer tools",
        operatingSystem: "Cross-platform",
        softwareVersion: SITE.version,
        license: `https://opensource.org/licenses/${SITE.license}`,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        programmingLanguage: ["TypeScript", "React"],
        runtimePlatform: "Node.js",
        codeRepository: SITE.githubUrl,
        downloadUrl: SITE.npmUrl,
        installUrl: `${SITE.url}/#install`,
        softwareHelp: SITE.docsUrl,
        releaseNotes: SITE.changelogUrl,
        softwareRequirements: Object.values(REQUIREMENTS).join("; "),
        featureList: HOME_PAGE.features.items.map((item) => item.title),
        author: { "@id": AUTHOR_ID },
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "HowTo",
        "@id": `${SITE.url}/#install`,
        name: "How to install Better Auth DevTools",
        description: HOME_PAGE.install.description,
        tool: [{ "@type": "HowToTool", name: "Better Auth" }],
        step: HOME_PAGE.install.steps.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title,
          text:
            step.kind === "install"
              ? `${plainText(step.description)} Run: ${HOME_PAGE.installCommand}`
              : `${plainText(step.description)}\n\n${step.code}`,
          url: `${SITE.url}/#step-${index + 1}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: HOME_PAGE.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
        })),
      },
    ],
  }
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
