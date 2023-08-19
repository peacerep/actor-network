# Documentation for Extending Templates

This dashboard uses:
- country data file in `json` format, i.e. `uk.json` or `russia.json`.
- `actor_info.json` used in `src/components/network.vue`; 
- `actor_definitions.json` used in `src/components/legends.vue`.

## Source Files
Stored in: `src/data/source/`

There's a jupyter notebook `Network schema.ipynb`. Run the scripts it will output a csv file, and a json file.

Please note: The output file contains only information used to construct networks (NetPanoraoma sepcs), support peace process selection, provide additional information in the dashboard.

Copy and move the output json file to the parent folder `src/data/`.


## Importing data

### Read in countryData
Country data is imported in `src/views/Homeview.vue` as `countryData`. It is parsed and passed to child component `src/component/peaceprocess.vue`, where we make the selection for peace process and render all the visualizations.

### Replace file path
For now, the country files are named as countryName.json. Therefore every time we replace it with a new country, we need to update all the visualization templates rendering methods, for NetPan reads in data path every time.

Files in need of care:
- `peaceprocess.vue` - `renderUpdateNew()`
- `network.vue` - `renderNetwork()`
- `list.vue` - `renderList()`
- `jigsaw.vue` - `renderJigsaw()`

### Replace country name text
We need to update all text containing country name, `countrytitle.vue` and `peaceprocess.vue` This is silly right now.

## Pending Fixes
- Automate country names and paths
- Timeline beeswarm graph lacks full responsiveness
- ...