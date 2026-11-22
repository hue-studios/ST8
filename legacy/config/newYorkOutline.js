// The New York State outline that sits behind the county map, lifted from the same artwork as
// components/layout/newYorkState.vue (the one in the site header) and simplified — it is a
// watermark, so a tenth of a unit of detail is not worth the bytes.
//
// NY_TRANSFORM places it in the county map's coordinate space.
//
// It is taken from the header drawing itself. components/layout/newYorkState.vue holds the state
// outline and the eight-county region as two paths in one artwork, already in register, so the
// region's box within the outline's box is the answer — no projection maths and nothing to fit.
// Measured there, the region sits at 36.942% across and 46.859% down, 32.538% wide and 25.058%
// tall; mapping that box onto the county shapes' own box gives the numbers below.
//
// Earlier attempts derived this from geography and from anchoring on the Pennsylvania border.
// Both put the border out by enough to see, because they relied on each drawing being faithful
// to the real world rather than on the one drawing where the two shapes were placed together.
//
// The offsets carry a small nudge on top of that box: the two drawings differ by about 2% in
// aspect, so no single transform lays every border exactly on top of its neighbour, and the
// residual is spent where it shows least — the 42°N run under Tioga and Broome.

export const NY_OUTLINE =
  'M185.5,158.3L186,158.2L185.5,157.5L184.6,157.6L184.4,158.1L184.6,156.5L186,157.6L189.6,158.3L191.9,157.3L192.1,156.3L191.6,155.8L192.8,155.4L194.9,155.9L199.1,155.7L206.9,154.6L211.4,151.7L212.3,150.4L213.6,149.9L214.8,148.2L215.8,148.2L217,147.3L218.3,147.1L216.6,149.1L216.8,148.5L215.6,148.4L215.3,149.1L216,150.1L217.2,150.4L217.7,151.8L219.8,152.1L220.9,151.3L222.5,153.5L223.8,152.3L224.9,152.1L225.6,151.1L226.4,151.3L226.6,150.1L228.1,149.6L229.4,149.9L228.3,151.3L214.4,158.6L195.1,167.4L189.1,169.3L186.5,169.1L180,171.3L174.3,171L169.3,173L169.5,171.7L167.2,171.9L167.4,171.2L166.3,170.5L166.2,169.7L167.4,167L166.6,166.6L166.8,165.1L169.2,159.6L170.1,155.4L146.6,142.3L145.1,140.5L145.1,139.3L143.4,139.7L143,138.9L142.4,139.4L141.5,138.9L140.4,139.1L140.6,138.6L139.8,137.6L137.8,137.6L137.8,136.5L137.3,136.5L136.8,134.8L135.1,132.8L136,132.3L135.3,129L135.8,128.7L135.7,127.4L135.3,126.6L134.2,126.4L135.1,124.8L133.9,124.4L133.7,123.5L132.5,123.4L132.2,122.6L131.8,123L131.2,122.6L130.6,123.1L129.7,123L129,120.1L127.3,118.8L127.2,117.9L126.7,117.7L55.1,117.8L0,116.3L0.4,105.9L9.4,100.7L12.3,97.6L13.1,97.8L15.5,96.1L18.3,95.5L19.4,93.2L20.8,92L21.4,90.3L25.1,88.6L26.9,86.8L26.5,85.3L26.8,84.6L25.5,82.3L25.5,80.8L22.4,78.6L23.1,76.2L21,75.3L21.5,74.2L21.2,73.7L22,72.8L21.3,68.2L33.5,64.9L37.7,64.3L48.6,64.4L58.3,66L64.2,70.1L70.1,68.4L76.7,68.1L78.5,68.9L81.1,68.9L82.6,67.9L85.7,67.3L88.4,66L90.1,63.4L96.2,59.2L99.6,59.6L101.4,58.8L102,57.7L102.3,53.8L101.8,50.2L101.2,47.6L99.4,47L99.5,46.3L101.8,44.6L101.2,46L102.1,46.4L104.2,44.6L104,42.8L105.1,41.8L106.1,41.7L106.1,41.3L105.3,40.9L103.9,42.1L102.2,42L102.1,41.1L103.6,40.4L104.3,39.3L103,39.5L103.5,38.4L101.8,38.5L102.1,37.7L100.3,38.7L99.9,40.1L102.2,39.7L101.2,41.6L99.8,42.2L100.3,41L99.3,40.4L99.5,38.5L98.4,38.3L98.4,37.8L97.7,38L98.1,37.4L97.4,36.9L99,33L102.3,32.2L103.1,31.5L103.1,29.9L106.4,27.9L110.1,26.5L112.5,24L114,20.8L123.6,10.7L124.8,10.3L127.5,7.4L131.1,5.8L131.2,5.1L134.1,3.8L135.1,2.6L137.3,2.4L139.5,1L141.8,2L143.9,1.3L156.7,1.5L180.2,0L179.9,1L180.4,3.6L179.4,6.4L180.8,8.7L180,10.2L179.5,15.2L182,19.7L182.4,22.1L181.4,25L182.2,28.7L180.2,31.7L179.1,37.4L180,38.4L180,41.6L181,43.6L181.2,45L180.6,45.9L181.9,47.8L179.9,52.9L179.9,55L181,55.7L181.5,53.5L183.4,53.3L183.8,55.2L184.8,55.7L185.3,56.9L185,85.2L185.8,87.3L179.9,113.1L180.5,114.4L180.5,116.3L179.7,143.6L181.8,146.8L174.8,151.3L177.1,154.6L177.1,156L176.2,157.3L175.2,157.4L174.9,158.2L174.6,158L173.2,160.5L173.5,161.6L173.2,160.8L172.5,161L172.9,162.5L174.3,164.1L174.3,161.5L175.8,162.3L175.6,161.4L175.2,161.6L174.9,161.1L175,160.4L176.6,160.7L177.4,161.7L177.2,159.8L177.8,158.8L181,158.1L181.5,158.8L180.7,159.4L181,158.5L180.3,158.7L180.5,159.7L181.6,159.9L181.5,159.1L181.9,159L182.7,160.1L181.8,158L182.1,157L183.5,157.4L183.6,158.4L185.5,158.3Z'

// translate(...) scale(...) applied to the path above, in county-map units.
export const NY_TRANSFORM =
  'translate(-1182.35, -904.83) scale(13.6659, 13.3576)'

export default NY_OUTLINE
