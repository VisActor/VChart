# Data Analysis Calculation Tool: Calculator

## Functionality/Input/Output

The tool inputs **"Raw Detailed Data"** obtained through analysis functions. Utilizing a query configuration structured similar to **"SQL-like Query Syntax"**, it computes **"Result Data"**.

The query calculation parameters are aligned with the structure of an "SQL Query Statement," and the methods for aggregation, filtering, and other computational processes are also in line with those in SQL. However, flexibility support is tailored according to the **"Usage Scenarios"**, simplifying some syntax and functionalities of SQL.

### Usage Example

A common SQL format example:
```sql
select <column>, ...
from <table>
where (... and ...)
group by ..., ...
having (... or ...)
order by ..., ...
limit 1000
```

Corresponding query configuration structure:

```typescript
import { query, type Query } from '@visactor/vmind/calculator'

query({
  from: data,
  select: { columns: [...] },
  where: { ... },
  groupBy: [...],
  having: { ... },
  orderBy: [...],
  limit: 1000,
})
```


## Specialized Support Capabilities

While aligning with SQL syntax and processing, some parts are simplified and specially supported according to "Usage Scenarios". Below are some examples of similarities and differences:

### Simplifications

**`from` section:**
  - Subqueries are not supported; scenarios requiring subqueries can be achieved by multiple invocations by the user.
  - Simplified `join` support, `union` not supported.

**`join` section:**
  - Supports only `Left Join`, `Right Join`, `Inner Join`, `Cross Join` as per current usage scenarios, does not support `Full` type joins.
  - Supports only the basic `using` condition, equivalent to the simplest `on` condition for joining two fields with the same name. As there are no other use cases, there is no support for conditions like `on between`, `on like`.
  - The `join` process is provided as a separate computational process, not described within the `query({ from })` model. Its result is used as input for the `from` section.

**`select` section:**
  - Only supports listing fields in `select`, does not support `select *`.
  - Complex "expression" calculations are converted to extendable JavaScript calculation functions that can be passed in by users for row/group data calculations. For example,
    - `id + 5` => `{ alias: 'id', column: ({ row }) => row.id + 5 }`
    - `sum(sale) / count(sale)` => `{ alias: 'id', aggregate: ({ group }) => sum(group, 'sale') / count(group, 'sale') }`
  - Direct establishment of field aliases `alias` in `select`, but other query configurations do not support referencing aliases.

**`offset` section:**
  - Currently does not support `offset`, only `limit`, as there are no use cases for `offset`, and its addition would be straightforward and unobstructed.

**Calculation Functions:**
  > Field-level `distinct` is completed before aggregation, e.g., `count(distinct <column>)`.
  - Support for complex "expression" calculations is converted into extendable JavaScript calculation functions, formatted as in `select`.
  - Custom aggregate processing functions can be passed in by users as needed.

**Data Format:**
  - Non-declarative field types, no internal validation of value formats and legality.
  - Supports `string`, `number`, `null` format fields.
  - Does not support `Date` / `boolean` type fields (no special judgments and processing).
    - If needed, `Date` types can be converted into basic ISO 8601 string format `YYYY-MM-DD`, equivalent to calculation as `string`.
  - Target usage is static data / HTTP API / JavaScript-generated data, thus does not support infinite precision number types or high precision numbers stored as `string` for calculations.
  - According to SQL equivalent format, values cannot have `undefined`, i.e., missing field values should be filled with `null`.
  - Does not support JSON format fields (Map / Array).

**Performance Optimization:**
  - As it is not a real database or SQL execution engine, it lacks optimizations like `indexes`, `logical optimizers` (query planners), `execution optimizers`.
  - Without `indexes`, the filtering process iterates through all row data.
  - Lacks a `logical optimizer`, such as simplification of `where`/`having` logic within equivalent ranges.
  - Lacks `execution logic optimization`, like advancing the `limit` process or sorting process within equivalent ranges.

### Special Support

- Adds support for custom sorting in `order by` (usage scenario-specific, **not standard SQL** support).
  - Does not support custom sorting for "aggregated

 calculation values" (no use case).

### SQL Equivalent Processing

- Aggregation, filtering, sorting processes for `null` values align with SQL.
  - Sum/average calculations are limited to numerical values, non-numeric sums are treated as zero.
    Empty row data results in null (no calculation result).
  - In filtering, only the `is null` operator matches `null` values (`=/!=` are ineffective).
  - In ascending/descending sorting, `null` values follow SQL's default rules (NULLS LAST).

- In filtering options,
  - `between` comparison is the same as in SQL, a closed interval.
  - Includes type conversion in comparison operations involving `number` / `string`.
  - Only `having` can perform aggregate calculations on fields.

- Apart from `group by`, if there are aggregate functions in the `select` column, they are also aggregated (aggregated into one row).
  - Without `group by`, and if there are no aggregate functions in `select`, `order by` cannot use aggregate calculations alone.

## Execution Process

The execution process within `calculator` for a `query()` call also fully references the general execution process of an SQL engine for a single SQL query.

A typical SQL query process includes the following steps:

1. Join / From
2. Where
3. Group By
4. Having
5. Order by
6. Select
7. Distinct
8. Offset / Limit

Except for `where` and `select`, the rest are optional steps.

In the execution process of the `calculator`'s `query()` function, these step names and meanings are consistent with SQL.

### 1. `From`

In SQL, `From` identifies the "data source table" for providing data. In the `query({ from })` function, there are no table entities; the `from` field is directly the row data itself `from: Row[];`.

In SQL, the "source table" in `From` can also be a virtual table, such as the result of another nested SQL query (subquery), e.g.,

```sql
select <column>
from (
  select <column>
  from <table>
  where ...
)
where ...
```

In `query()`, subquery syntax is not supported, but it can be achieved by nested calls by the user, e.g.,

```typescript
query({
  from: query({
    from: data,
    select: { columns: [...] },
    where: { ... },
    ...
  }),

  select: { columns: [...] },
  where: { ... },
  ...
})
```

#### `join`

In SQL, `join` is a sub-clause of `from`, executed according to different `join` types (`left / right / inner / full / exclude`, etc.) and corresponding field matching rules. For each matched field, the corresponding M, N rows are selected from the left and right tables, respectively, forming a Cartesian product virtual table of M x N rows.

In the calculation library usage, `join` is provided as a separate computational process, not described within the `query({ from })` model. Its result is used as input for the `from` section, used as follows:

```typescript
query({
  from: leftJoin({
    left: query( ... ),
    right: query( ... ),
  }),

  select: { columns: [...] },
  where: { ... },
  ...
})
```


### 2. `Where`

Filters **"Raw Detailed Data"** (`TableData`) (un-grouped/non-aggregated data). In SQL syntax, filtering conditions support multiple nested `and` and `or` relationships.

In the `query({ where })` function, the `where` field correspondingly supports different filtering conditions combined into a "tree structure" (filter tree) through multiple nested `and` and `or`.

### 3. `Group By`

Groups raw data based on one or more fields, outputting multiple **"Grouped Data"** sets, divided by different column values for subsequent aggregation calculations. Each group's data is aggregated separately.

SQL queries inherently return "row-level data," unable to represent a pivoted structure. The multiple pivoted structure is maintained internally during the `Group By` stage for grouping, and it's converted to a flat detail table structure when outputting.

The order of each group in the "Grouped Data" is maintained as the order of the first row of each group in the raw data. The order of all rows within each group is also maintained as their original relative order.

`Group By` **only groups** and does not perform aggregation calculations (`count`/`sum` ...).

### 4. `Having`

Applies filters to each group in **"Grouped Data"** (`GroupedData`). The filtering conditions have a tree-like logical structure similar to that in `Where`,

#### Aggregation Calculation

However, `Having` allows the use of **"aggregate functions"** during filter processing. It performs an **"aggregate calculation"** on all rows within a group, producing a single value used in filtering conditions,

```sql
having id > 5 and count(email) > 5 and count(distinct email) > 5
```

When fields not using aggregate functions are present, the first row of each group is used by default, effectively representing the entire group;

During aggregate calculations, the `distinct` keyword can be used for deduplication, indicating that the calculation is performed on a deduplicated set of values for that field;

### 5. `Order By`

Sorts the input data. Without a preceding `Group By`, the input is **"raw detailed data"** and sorting is based only on individual rows.

For **"Grouped Data"**, **"aggregate functions"** can be used to determine the order of groups, with the aggregation process being the same as in `Having`;

`Order By` only changes the order of groups in **"Grouped Data"**, not the order of the original detailed rows within each group;

#### Manual Sorting

In platform use cases, **"Manual Sorting"** is implemented by converting manually set order values into `case when` statements in the `Order By` part of SQL statements, like:

```sql
order by case
  when name = '...' then 1
  when name = '...' then 2
  when name = '...' then 3
  else 4
end ASC
```

In the `query()` function, there is no support for `case when`, but manual sorting configurations are added in the `orderBy` field.

### 6. `Select`

`Select` is used to **"extract"** specific field columns from the output data. This process involves two steps:

- If the input is **"Grouped Data"**, it aggregates each group into a single row (row) through aggregation calculations, similar to those in `Having`;
  Essentially transforming **"Grouped Data"** into **"detailed data"** rows equal in number to the groups.
- **"Extracts"** fields from each row and sets corresponding aliases.

### 7. `Distinct`

This is equivalent to the SQL syntax `select distinct ...`, indicating deduplication of rows in the final output data of `Select`.

### 8. `Offset`/`Limit`

Truncates the output data to the first N items, or offsets by the first M items before truncating to N items.
