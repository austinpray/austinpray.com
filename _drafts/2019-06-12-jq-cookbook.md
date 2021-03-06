---
layout: post 
title: "Notes: jq Cookbook" 
date: 2019-06-12
---

[jq][] is one of my favorite programs. Too bad I suck at remembering all the "clever" commands I come up with.

> jq is like sed for JSON data - you can use it to slice and filter and map and transform structured data with the same ease that sed, awk, grep and friends let you play with text.

# whitelist keys in an array of objects

Pluck keys in an array of objects

## input
  
```json
{
  "ok": true,
  "emoji": [
    {
      "name": "yui7",
      "is_alias": 0,
      "alias_for": null,
      "url": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png",
      "created": 1559952810,
      "team_id": "SENSITIVE?",
      "user_id": "SENSITIVE?",
      "user_display_name": "Chungo",
      "avatar_hash": "SENSITIVE?",
      "can_delete": false,
      "is_bad": false,
      "synonyms": null
    }
  ]
}
```

## command


```bash
.emoji | map({name: .name, url: .url})
```

## output
  
```json
[
  {
    "name": "yui7",
    "url": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png"
  }
]
```

# reduce an array of objects to an object

Convert array of objects to object with named keys:

## input
  
```json
[
  {
    "name": "yui7",
    "url": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png"
  },
    {
    "name": "yuiclap",
    "url": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png"
  }
]
```

## command

```bash
map({ (.name|tostring): .url}) | add
```

## output

```json
{
  "yui7": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png",
  "yuiclap": "https://emoji.slack-edge.com/???/yui7/8ad4dfd99e5ff5d1.png"
}

```

# ripgrep to versioned github links

```bash
export _REPO=your/repo
export _COMMIT=$(git rev-parse HEAD)
rg --json 'WHATEVER' |\
  jq 'select(.type == "match")' |\
  jq -r "\"https://github.com/$_REPO/blob/$_COMMIT/\(.data.path.text)#L\(.data.line_number)\""
```

Outputs versioned urls like `https://github.com/austinpray/austinpray.com/blob/4b92ab98d3a858b3916e8177228434ff24f8f1d0/.gitignore`

[jq]: https://stedolan.github.io/jq/
