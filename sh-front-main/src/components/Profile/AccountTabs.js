import React from "react";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Text,
  Box,
  Flex,
  Center,
  Button,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { SectionHeader } from "components/commons/SectionHeader";
import { ProfileForm } from "./ProfileForm";
import { ProfileFormOwner } from "./ProfileFormOwner";
import { PublicationsList } from "./PublicationsList";
import { Tags } from "components/Tags";
import { sections } from "config/sections";
import { authSelector } from "store/slices/authSlice";
import { USER_CATEGORIES } from "const";
import { AddOwnership } from "components/Owneship/AddOwnership";
import { UsersList } from "components/Admin/UsersList";
import { RequestsList } from "components/Admin/RequestsList";
import { StudentRents } from "components/StudentRents";

const PAGE = "profile";

export function AccountTabs() {
  const { profile, tags, questions, ListOfUsers } = sections;

  const { user_category } = useSelector(authSelector);

  return (
    <>
      <Tabs variant="soft-rounded" colorScheme="gray">
        <TabList>
          <Tab>Mi cuenta</Tab>
          {user_category === USER_CATEGORIES.OWNER ? (
            <Tab>Propiedades</Tab>
          ) : (
            <></>
          )}
          {user_category === USER_CATEGORIES.STUDENT ? (
            <Tab>Mis Rentas</Tab>
          ) : (
            <></>
          )}
          {/* Pestaña de usuarios. Solo visible para admin */}
          {user_category === USER_CATEGORIES.ADMIN ? (
            <Tab>Usuarios</Tab>
          ) : (
            <></>
          )}
          {/* Pestaña de solicitudes. Solo visible para admin */}
          {user_category === USER_CATEGORIES.ADMIN ? (
            <Tab>Solicitudes</Tab>
          ) : (
            <></>
          )}
        </TabList>
        <TabPanels>
          <TabPanel>
            <SectionHeader
              section={profile.section}
              sectionTitle={profile.titleAccount}
            />
            {user_category === USER_CATEGORIES.STUDENT ? (
              <ProfileForm />
            ) : (
              <ProfileFormOwner />
            )}
          </TabPanel>

          {user_category === USER_CATEGORIES.OWNER ? (
            <TabPanel>
              <SectionHeader
                section={profile.section}
                sectionTitle={profile.titleOwnerships}
              />
              <AddOwnership />
              <PublicationsList />
            </TabPanel>
          ) : null }

          {/* pestaña de usuarios. Solo visible para admin */}
          {user_category === USER_CATEGORIES.ADMIN ? (
            <TabPanel>
              <SectionHeader
                section={ListOfUsers.section}
                sectionTitle={ListOfUsers.title}
              />
              <UsersList />
            </TabPanel>
          ) : null }

          {/* Pestaña de solicitudes. Solo visible para admin */}
          {user_category === USER_CATEGORIES.ADMIN ? (
            <TabPanel>
              <SectionHeader
                section={ListOfUsers.section}
                sectionTitle={ListOfUsers.title}
              />
              <RequestsList />
            </TabPanel>
          ) : null }

          {user_category === USER_CATEGORIES.OWNER ? (
          <TabPanel>
            <SectionHeader
              section={profile.section}
              sectionTitle={profile.titleOwnerships}
            />
            <AddOwnership />
            <PublicationsList />
          </TabPanel>
          ) : null }

          {user_category === USER_CATEGORIES.STUDENT ? (
            <TabPanel>
              {/* <SectionHeader
                section={questions.section}
                sectionTitle={questions.title}
              /> */}
              <StudentRents />
            </TabPanel>
          ) : null }
          
          {user_category === USER_CATEGORIES.STUDENT ? (
            <TabPanel>
              <SectionHeader section={tags.section} sectionTitle={tags.title} />
              <Tags fromPage={PAGE} />
            </TabPanel>
          ) : null }

        </TabPanels>
      </Tabs>
    </>
  );
}
