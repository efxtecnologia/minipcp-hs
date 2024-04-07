function depResolved(components, dep) {
    return components[dep] !== undefined;
}

function depsResolved(components, definition) {
    return definition.deps.length === 0 ||
        definition.deps.reduce((ok, dep) => ok && depResolved(components, dep), true);
}

function withResolvedDeps(components, definitions) {
    return definitions.filter(d => depsResolved(components, d));
}

function pendingComponents(components, definitions) {
    const created = Object.keys(components);
    return definitions.filter(d => ! created.includes(d.name));
}

function instantiate(components, { name, constructor }) {
    return { ...components, [name]: constructor(components) };
}

function resolveDependencies(components, componentDefinitions) {
    const pending = pendingComponents(components, componentDefinitions);
    if (pending.length === 0) {
        return components;
    }

    const resolved = withResolvedDeps(components, pending);
    if (resolved.length === 0) {
        return {
            error: "Some components dependencies could not be resolved",
            pending,
        };
    }

    return resolveDependencies(resolved.reduce(instantiate, components), componentDefinitions);
}

module.exports = {
    depResolved,
    depsResolved,
    withResolvedDeps,
    resolveDependencies,
};
