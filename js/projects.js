document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section');
  const coverImageBySection = {
    'kitchen-bathroom': {
      src: 'images/Pool%20Photos/723599269_1934946720499446_7269440237974761863_n.jpg',
      alt: 'The Pool Surround Revamp',
    },
    'outdoor-living': {
      src: 'images/Outdoor%20Kitchen/20211121_110210.jpg',
      alt: 'Alfresco cooking area',
    },
    'electrical-works': {
      src: 'images/Full%20Landscaping%20Project/722285674_983400127865369_2809518213223084500_n.jpg',
      alt: 'Coastal Garden Renovation',
    },
  };
  const defaultDescriptions = {
    'kitchen-bathroom': 'On this site “We were commissioned to build the surrounding walls and patio for a newly installed pool, completing the space with quality brickwork and a clean layout.”',
    'outdoor-living': 'A personal project that gave us an opportunity to experiment with and refine our alfresco areas.',
    'electrical-works': 'A full garden makeover that involved the whole family team.',
  };

  sections.forEach((section, index) => {
    const heading = section.querySelector('h3');
    const gallery = section.querySelector('.gallery');

    if (!heading || !gallery) {
      return;
    }

    const titleText = heading.textContent.trim();
    const coverConfig = coverImageBySection[section.id];
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', `project-panel-${index}`);

    if (coverConfig) {
      const cover = document.createElement('img');
      cover.src = coverConfig.src;
      cover.alt = coverConfig.alt || titleText;
      cover.className = 'section-toggle__thumb';
      cover.setAttribute('aria-hidden', 'true');
      cover.loading = 'eager';
      cover.decoding = 'async';
      toggle.appendChild(cover);
    } else {
      const fallbackImage = gallery.querySelector('img');
      if (fallbackImage) {
        const cover = fallbackImage.cloneNode(true);
        cover.className = 'section-toggle__thumb';
        cover.alt = '';
        cover.setAttribute('aria-hidden', 'true');
        cover.loading = 'eager';
        toggle.appendChild(cover);
      }
    }

    const label = document.createElement('span');
    label.className = 'section-toggle__label';
    label.textContent = titleText;

    const state = document.createElement('span');
    state.className = 'section-toggle__state';
    state.textContent = 'Show';

    const textWrap = document.createElement('span');
    textWrap.className = 'section-toggle__text';
    textWrap.append(label, state);

    toggle.append(textWrap);

    heading.textContent = '';
    heading.appendChild(toggle);

    const panel = document.createElement('div');
    panel.className = 'section-panel';
    panel.id = `project-panel-${index}`;
    panel.hidden = true;

    const descriptionLabel = document.createElement('label');
    descriptionLabel.className = 'section-description__label';
    descriptionLabel.htmlFor = `project-description-${index}`;
    descriptionLabel.textContent = 'Project description';

    const description = document.createElement('textarea');
    description.className = 'section-description';
    description.id = `project-description-${index}`;
    description.rows = 4;
    description.placeholder = 'Write a short description of this project...';

    const storageKey = `bizley-project-description-${section.id}`;
    const defaultDescription = defaultDescriptions[section.id] || '';

    try {
      const savedDescription = localStorage.getItem(storageKey);
      description.value = savedDescription || defaultDescription;

      if (!savedDescription && defaultDescription) {
        localStorage.setItem(storageKey, defaultDescription);
      }
    } catch (error) {
      description.value = defaultDescription;
    }

    description.addEventListener('input', () => {
      try {
        localStorage.setItem(storageKey, description.value);
      } catch (error) {
        // Ignore storage failures and keep the field usable.
      }
    });

    section.insertBefore(panel, gallery);
    panel.append(descriptionLabel, description, gallery);

    const setExpanded = (expanded) => {
      toggle.setAttribute('aria-expanded', String(expanded));
      state.textContent = expanded ? 'Hide' : 'Show';
      panel.hidden = !expanded;
      section.classList.toggle('is-open', expanded);
    };

    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      setExpanded(!isExpanded);
    });
  });
});