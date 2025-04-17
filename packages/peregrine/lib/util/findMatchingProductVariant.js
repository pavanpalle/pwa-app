export const findMatchingVariant = ({
    variants,
    optionCodes,
    optionSelections
}) => {
    return variants.find(({ attributes, product }) => {
        const customAttributes = (attributes || []).reduce(
            (map, { code, value_index }) => new Map(map).set(code, value_index),
            new Map()
        );

        for (const [id, values] of optionSelections) {
            if (!values || !Array.isArray(values)) continue;

            const code = optionCodes.get(id);
            const matches = values.some((value) => {
                const matchesStandard = product[code] === value;
                const matchesCustom = customAttributes.get(code) === value;
                return matchesStandard || matchesCustom;
            });

            if (!matches) {
                return false;
            }
        }

        return true;
    });
};
