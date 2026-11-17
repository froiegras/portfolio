import './Icons.css';

const ctx = require.context('../../../assets/icons', false, /\.svg$/i);
const icons = Object.fromEntries(
  ctx.keys().map((key) => {
    const mod = ctx(key);
    const name = key.replace(/^\.\/|\.svg$/gi, '').toLowerCase();

    return [
      name,
      {
        Svg: typeof mod === 'function' ? mod : mod.ReactComponent || mod.default,
        url: typeof mod === 'string' ? mod : mod.url
      },
    ];
  })
);


if (process.env.NODE_ENV !== 'production') {
  console.log(
    'icons loaded:',
    Object.entries(icons).map(([n, v]) => `${n} (${v.Svg ? 'component' : v.url ? 'url only' : 'EMPTY'})`)
  );
}

export default function Icon({ name, size = '1em', className = '', title }) {
  const entry = icons[String(name).toLowerCase()];

  if (!entry) {
    if (process.env.NODE_ENV !== 'production' && /^[a-z][\w-]*$/i.test(name)) {
      console.warn(`Icon "${name}" not found. Available:`, Object.keys(icons));
    }
    return <span className={className} aria-hidden={title ? undefined : true}>{name}</span>;
  }

  const a11y = title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true };

  if (entry.Svg) {
    const { Svg } = entry;
    return (
      <Svg
        className={`icon ${className}`.trim()}
        width={size}
        height={size}
        focusable="false"
        {...a11y}
      />
    );
  }

  return (
    <span
      className={`icon icon-mask ${className}`.trim()}
      style={{ width: size, height: size, '--icon': `url(${entry.url})` }}
      {...a11y}
    />
  );
}