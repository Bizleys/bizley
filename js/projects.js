document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main section');
  const coverImageBySection = {
    'kitchen-bathroom': '723599269_1934946720499446_7269440237974761863_n.jpg',
    'outdoor-living': '20211121_110210.jpg',
    'electrical-works': '722285674_983400127865369_2809518213223084500_n.jpg',
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
    const coverFilename = coverImageBySection[section.id];
    const coverImage = coverFilename
      ? Array.from(gallery.querySelectorAll('img')).find((image) => {
          const sourcePath = image.getAttribute('src') || '';
          return sourcePath.split('/').pop() === coverFilename;
        })
      : gallery.querySelector('img');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'section-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', `project-panel-${index}`);

    if (coverImage) {
      const cover = coverImage.cloneNode(true);
      cover.className = 'section-toggle__thumb';
      cover.alt = '';
      cover.setAttribute('aria-hidden', 'true');
      toggle.appendChild(cover);
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