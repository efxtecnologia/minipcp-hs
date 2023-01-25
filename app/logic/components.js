
function depResolved(components, dep) {
    return components[dep] !== undefined;
}

const depPending = (components, dep) => ! depResolved(components, dep);

function depsResolved(components, definition) {
    return definition.deps.length === 0 ||
        definition.deps.reduce((ok, dep) => ok && depResolved(components, dep), true);
}

function depsPending(components, definition) {
    return definition.deps.length > 0 &&
        definition.deps.reduce((pending, dep) => pending || depPending(components, dep), false);
}

function withResolvedDeps(components, definitions) {
    return definitions.filter(d => depsResolved(components, d));
}

function withPendingDeps(components, definitions) {
    return definitions.filter(d => depsPending(components, d));
}

function instantiate(components, { name, constructor }) {
    return { ...components, [name]: constructor(components) };
}

function moreComponents(components, componentDefinitions) {
    const pending = withPendingDeps(components, componentDefinitions);
    if (pending.length === 0) {
        return components;
    }
    const resolved = withResolvedDeps(components, pending).reduce(instantiate, components);
    if (resolved.length === 0) {
        return {
            error: "Some components dependencies could not be resolved",
            pending,
        };
    }
    return moreComponents(resolved.reduce(instantiate, components), componentDefinitions);
}

module.exports = {
    depResolved,
    depPending,
    depsPending,
    depsResolved,
    withResolvedDeps,
    withPendingDeps,
    moreComponents,
};
