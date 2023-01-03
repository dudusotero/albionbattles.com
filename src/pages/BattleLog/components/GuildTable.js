import React, { useState } from "react";
import FlexboxGrid from "rsuite/lib/FlexboxGrid";
import List from "rsuite/lib/List";
import Button from "rsuite/lib/Button";
import InputGroup from "rsuite/lib/InputGroup";
import Container from "rsuite/lib/Container";
import Input from "rsuite/lib/Input";
import Icon from "rsuite/lib/Icon";
import Checkbox from "rsuite/lib/Checkbox";
import Panel from "rsuite/lib/Panel";
import Col from "rsuite/lib/Col";
import Pagination from "rsuite/lib/Pagination";
import abbreviate from "number-abbreviate";

const intToString = (value, prec) => {
  return abbreviate(value, prec || 1);
};

// const text_truncate = function (str, length, ending) {
//     if (length == null) {
//         length = 100;
//     }
//     if (ending == null) {
//         ending = '...';
//     }
//     if (str.length > length) {
//         return str.substring(0, length - ending.length) + ending;
//     } else {
//         return str;
//     }
// };

const GuildTable = ({ guilds: g }) => {
  const [activePage, setActivePage] = useState(1);
  const [sort, setSort] = useState("killFame");
  const [search, setSearch] = useState("");
  const [showLow, setShowLow] = useState(true);
  const [sortDirection, setSortDirection] = useState(true);
  const guilds = showLow ? [...g] : [...g].filter((i) => !i.low);
  const maxKills =
    guilds.length > 0 ? guilds.sort((a, b) => b.kills - a.kills)[0].kills : 0;
  const maxKillFame =
    guilds.length > 0
      ? guilds.sort((a, b) => b.killFame - a.killFame)[0].killFame
      : 0;
  const handleSort = (column) => (_) => {
    if (sort === column) {
      setSortDirection(!sortDirection);
    } else {
      setSort(column);
      setSortDirection(true);
    }
  };

  const renderSortHeader = (header, field, flex) => {
    return (
      <div style={{ display: "flex", justifyContent: flex }}>
        <Button size="xs" onClick={handleSort(field)} appearance="subtle">
          {header}
          {sort === field && !sortDirection && (
            <Icon icon="sort-up" style={{ color: "#34c3ff" }} />
          )}
          {sort === field && sortDirection && (
            <Icon icon="sort-desc" style={{ color: "#34c3ff" }} />
          )}
          {sort !== field && <Icon icon="sort" style={{ color: "#34c3ff" }} />}
        </Button>
      </div>
    );
  };

  const handleShowLow = (_, checked) => {
    setShowLow(checked);
  };

  //eslint-disable-next-line
  sort &&
    guilds.sort((a, b) => {
      if (sort === "name" || sort === "alliance" || sort === "guildName") {
        if (sortDirection) {
          if (a[sort].toLowerCase() < b[sort].toLowerCase()) {
            return -1;
          }
          if (a[sort].toLowerCase() > b[sort].toLowerCase()) {
            return 1;
          }
        } else {
          if (a[sort].toLowerCase() < b[sort].toLowerCase()) {
            return 1;
          }
          if (a[sort].toLowerCase() > b[sort].toLowerCase()) {
            return -1;
          }
        }
      } else {
        if (sortDirection) {
          return b[sort] - a[sort];
        }
        return a[sort] - b[sort];
      }
    });

  let visible = guilds
    .filter((i) => {
      return (
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.alliance.toLowerCase().includes(search.toLowerCase())
      );
    })
    .slice((activePage - 1) * 10, activePage * 10);

  const renderGuildStats = (guild, index) => {
    let topKills = guild.kills === maxKills;
    let topFame = guild.killFame === maxKillFame;
    let borderClass =
      topKills && topFame
        ? "fameandkills"
        : topKills
        ? "topkills"
        : topFame
        ? "topfame"
        : null;
    return (
      <List.Item
        key={guild.id}
        className={borderClass}
        style={{
          color: guild.low ? "#666" : "#EEEEEE",
        }}
      >
        <FlexboxGrid>
          <FlexboxGrid.Item componentClass={Col} md={6} xs={6} sm={6}>
            <p style={{ paddingLeft: "1rem" }}>{guild.name}</p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item
            componentClass={Col}
            md={3}
            xs={5}
            sm={5}
            smHidden
            xsHidden
          >
            <p style={{ textAlign: "right", paddingRight: 15 }}>
              {guild.alliance}
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={5} sm={5}>
            <p style={{ textAlign: "right", paddingRight: 15 }}>
              {guild.totalPlayers}
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={4} sm={4}>
            <p
              style={{
                textAlign: "right",
                paddingRight: 15,
                color: topKills ? "rgb(224, 41, 131)" : null,
              }}
            >
              {guild.kills}
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={5} sm={5}>
            <p style={{ textAlign: "right", paddingRight: 15 }}>
              {guild.deaths}
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={4} sm={4}>
            <p
              style={{
                textAlign: "right",
                paddingRight: 15,
                color: topFame ? "#29e09d" : null,
              }}
            >
              {intToString(guild.killFame)}
            </p>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item
            componentClass={Col}
            md={3}
            xs={3}
            smHidden
            xsHidden
          >
            <p style={{ textAlign: "right", paddingRight: 15 }}>
              {guild.averageIp}
            </p>
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </List.Item>
    );
  };

  return (
    <Container>
      <Panel
        header={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {showLow ? (
              <p>{`Guilds (${guilds.length})`}</p>
            ) : (
              <p>
                {`Guilds (${guilds.length})`}
                <span style={{ color: "#666", marginLeft: "1rem" }}>{`${
                  g.length - guilds.length
                } hidden`}</span>
              </p>
            )}
            <InputGroup
              size="sm"
              inside
              style={{ width: 200, marginLeft: "2rem", marginRight: "auto" }}
            >
              <Input
                placeholder="Search..."
                value={search}
                onChange={setSearch}
              />
              <InputGroup.Button>
                <Icon icon="search" />
              </InputGroup.Button>
            </InputGroup>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ color: "#666666", textAlign: "right" }}>
                Show low participation
              </p>
              <Checkbox checked={showLow} onChange={handleShowLow} />
            </div>
          </div>
        }
        style={{ backgroundColor: "#0f131a", minHeight: 627 }}
      >
        <FlexboxGrid style={{ marginBottom: "1rem", color: "#AAAAAA" }}>
          <FlexboxGrid.Item componentClass={Col} md={6} xs={6} sm={6}>
            {renderSortHeader("Name", "name", "flex-start")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item
            componentClass={Col}
            md={3}
            xs={4}
            sm={4}
            smHidden
            xsHidden
          >
            {renderSortHeader("Alliance", "alliance", "flex-end")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={5} sm={5}>
            {renderSortHeader("Players", "totalPlayers", "flex-end")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={4} sm={4}>
            {renderSortHeader("Kills", "kills", "flex-end")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={5} sm={5}>
            {renderSortHeader("Deaths", "deaths", "flex-end")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xs={4} sm={4}>
            {renderSortHeader("Fame", "killFame", "flex-end")}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item componentClass={Col} md={3} xsHidden smHidden>
            {renderSortHeader("IP", "averageIp", "flex-end")}
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <List hover>{visible.map(renderGuildStats)}</List>
        <div
          style={{
            marginLeft: "auto",
            position: "absolute",
            bottom: 0,
            right: "1rem",
          }}
        >
          {guilds.length > 10 && (
            <Pagination
              first={true}
              last={true}
              pages={Math.ceil(guilds.length / 10)}
              maxButtons={5}
              next={true}
              prev={true}
              activePage={activePage}
              onSelect={setActivePage}
            />
          )}
        </div>
      </Panel>
    </Container>
  );
};

export default GuildTable;
