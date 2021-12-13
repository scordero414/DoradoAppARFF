import React, { useRef, useState, useEffect } from "react";
import {
    StyleSheet,
    ScrollView,
    Share,
    Platform,
    TouchableOpacity,
} from "react-native";
import {
    NativeBaseProvider,
    Box,
    Heading,
    VStack,
    Button,
    Input,
    Icon,
    IconButton,
    HStack,
    Text,
    View,
    Radio,
    Progress,
    FlatList,
    Spinner,
    Spacer,
    Divider,
    Pressable,
    Menu,
    HamburgerIcon,
    Checkbox,
    Modal,
    Badge,
    FormControl,
    Select,
    CheckIcon,
} from "native-base";
import {
    Ionicons,
    MaterialIcons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { store } from "../constants/keys";

const ListRevisions = (props) => {
    const [allRevisions, setAllRevisions] = useState([]);
    const [filterRevisions, setFilterRevisions] = useState([]);
    const [search, setSearch] = useState("");
    const [size, setSize] = useState(0);
    const [isForRevision, setForRevision] = useState(false);
    const [isForTypeExtintor, setForTypeExtintor] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [typeExtintor, setTypeExtintor] = useState("");
    const [sizeOfExtintors, setSizeOfExtintors] = useState(0);

    useEffect(() => {
        getRevisions();
    }, []);

    const getRevisions = () => {
        store
            .collection("revision_extintores")
            .get()
            .then((snapshot) => {
                console.log("LENGTH", snapshot.docs.length);
                setSizeOfExtintors(snapshot.docs.length);
                snapshot.docs.map((revision) => {
                    let currentID = revision.id;
                    getExtintorById(revision.data().extintor).then((ext) => {
                        // ext = { ...ext, ["id"]: ext.id };
                        getUserById(revision.data().userId).then((user) => {
                            // user = { ...user, ["id"]: user.id };
                            let appObj = {
                                ...revision.data(),
                                ["id"]: currentID,
                                userId: user,
                                extintor: ext,
                            };
                            setAllRevisions((oldArray) => [
                                ...oldArray,
                                appObj,
                            ]);
                        });
                    });
                });
            });
    };

    const searchFilterFunction = (text) => {
        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource and update FilteredDataSource
            const newData = allRevisions.filter(function (item) {
                // Applying filter for the inserted text in search bar
                const itemData1 = item.extintor.codigo
                    ? item.extintor.codigo.toUpperCase()
                    : "".toUpperCase();

                const itemData2 = item.userId.nombre
                    ? item.userId.nombre.toUpperCase()
                    : "".toUpperCase();
                const textData = text.toUpperCase();
                return (
                    (itemData1.indexOf(textData) > -1) |
                    (itemData2.indexOf(textData) > -1)
                );
            });
            setFilterRevisions(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            if (isForRevision) {
                checkPropsInExtintors();
            } else {
                setFilterRevisions([]);
                setSearch(text);
            }
        }
    };

    const getExtintorById = async (id) => {
        const snapshot = await store.collection("extintores").doc(id).get();
        return snapshot.data();
    };
    const getUserById = async (id) => {
        const snapshot = await store.collection("usuarios").doc(id).get();
        return snapshot.data();
    };
    const dateFormat = (date) => {
        return (
            (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
            "/" +
            (date.getMonth() > 8
                ? date.getMonth() + 1
                : "0" + (date.getMonth() + 1)) +
            "/" +
            date.getFullYear()
        );
    };

    const goNewRevision = (revision) => {
        props.navigation.navigate("Revision", {
            revision: revision,
            userId: null,
        });
        console.log(revision);
    };

    const handleFilterCheckExtintor = () => {
        setForTypeExtintor(false);
        if (!isForRevision) {
            checkPropsInExtintors("regular");
        } else {
            setFilterRevisions([]);
        }
        setForRevision(!isForRevision);
    };
    const handleFilterType = () => {
        setForRevision(false);
        if (!isForTypeExtintor) {
            checkPropsInExtintors("tipoAgente");
        } else {
            setFilterRevisions([]);
        }
        setForTypeExtintor(!isForTypeExtintor);
    };

    const checkPropsInExtintors = (prop) => {
        setFilterRevisions([]);
        allRevisions.map((revision) => {
            for (const property in revision.extintor) {
                if (typeof revision.extintor[property] === "string") {
                    if (prop == "regular") {
                        // if (revision.extintor[property] == ["Regular" || "Malo" || "N/T"]) {
                        if (
                            revision.extintor[property] == "Regular" ||
                            revision.extintor[property] == "Malo" ||
                            revision.extintor[property] == "N/T"
                        ) {
                            setFilterRevisions((oldArray) => [
                                ...oldArray,
                                revision,
                            ]);
                            return;
                        }
                    }
                    if (prop == "tipoAgente") {
                        if (revision.extintor[property] == typeExtintor) {
                            setFilterRevisions((oldArray) => [
                                ...oldArray,
                                revision,
                            ]);
                            return;
                        }
                    }
                }
            }
        });
    };

    const renderRevision = (revision) => {
        return (
            <TouchableOpacity
                onPress={() => goNewRevision(revision)}
                key={revision.id}
            >
                <Box
                    borderBottomWidth={2}
                    _dark={{
                        borderColor: "gray.600",
                    }}
                    borderColor="coolGray.200"
                    pl="4"
                    pr="5"
                    py="2"
                >
                    <HStack space={3} justifyContent="space-between">
                        <VStack>
                            <Text
                                _dark={{
                                    color: "warmGray.50",
                                }}
                                color="coolGray.800"
                                bold
                            >
                                {revision.extintor?.codigo}
                            </Text>

                            <Text
                                color="coolGray.600"
                                _dark={{
                                    color: "warmGray.200",
                                }}
                            >
                                {revision.userId?.nombre}
                            </Text>
                        </VStack>
                        <Spacer />
                        <Text
                            fontSize="sm"
                            _dark={{
                                color: "warmGray.50",
                            }}
                            color="coolGray.800"
                            alignSelf="center"
                        >
                            {dateFormat(revision?.ultima_modificacion.toDate())}
                        </Text>
                    </HStack>
                </Box>
            </TouchableOpacity>
        );
    };

    const modalFilter = (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px" style={styles.topModal}>
                <Modal.CloseButton />
                <Modal.Header>Filtrar</Modal.Header>
                <Modal.Body alignItems="flex-start">
                    <Checkbox
                        my="1"
                        mx={2}
                        colorScheme="info"
                        isChecked={isForRevision}
                        onChange={handleFilterCheckExtintor}
                        accessibilityLabel="choose numbers"
                    >
                        Extintores pendientes.
                    </Checkbox>

                    <Checkbox
                        my="1"
                        mx={2}
                        colorScheme="info"
                        isChecked={isForTypeExtintor}
                        onChange={handleFilterType}
                        accessibilityLabel="choose numbers"
                        isDisabled={!typeExtintor.length ? true : false}
                    >
                        Tipo de agente
                        <Select
                            ml={2}
                            selectedValue={typeExtintor}
                            minWidth={120}
                            p={1}
                            // minHeight={15}
                            placeholder="Selecciona uno..."
                            onValueChange={(itemValue) => {
                                // props.extintor.tipoAgente = itemValue
                                setTypeExtintor(itemValue);
                                if (isForTypeExtintor) {
                                    handleFilterType();
                                }
                            }}
                            _selectedItem={{
                                bg: "cyan.600",
                                endIcon: <CheckIcon size={4} />,
                            }}
                        >
                            <Select.Item label="CO2" value="CO2" />
                            <Select.Item label="ABC" value="ABC" />
                            <Select.Item label="AL" value="AL" />
                            <Select.Item label="BCL" value="BCL" />
                            <Select.Item label="ABC L" value="ABC L" />
                            <Select.Item label="BC" value="BC" />
                            <Select.Item label="ES" value="ES" />
                        </Select>
                    </Checkbox>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    );

    return (
        <NativeBaseProvider>
            <View style={styles.container}>
                <HStack
                    bg="#0c4a6e"
                    px={1}
                    py={3}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <HStack mt={10} space={4} alignItems="center">
                        <IconButton
                            onPress={() => props.navigation.goBack()}
                            icon={
                                <Icon
                                    size="sm"
                                    as={<MaterialIcons name="arrow-back" />}
                                    color="white"
                                />
                            }
                        />
                        <Text color="white" fontSize={20} fontWeight="bold">
                            Revisiones realizadas
                        </Text>
                    </HStack>
                </HStack>

                <Box flex={1} w="100%">
                    <ScrollView>
                        <VStack mx={3} my={3}>
                            <VStack width="100%" space={5} alignItems="center">
                                <Input
                                    placeholder="Busca revisiones por su código"
                                    bg="#fff"
                                    width="100%"
                                    borderRadius={4}
                                    isDisabled={sizeOfExtintors === allRevisions.length && sizeOfExtintors > 0 ? false: true}
                                    py="3"
                                    px="1"
                                    fontSize={14}
                                    onChangeText={(text) =>
                                        searchFilterFunction(text)
                                    }
                                    value={search}
                                    _web={{
                                        _focus: {
                                            borderColor: "muted.300",
                                            style: { boxShadow: "none" },
                                        },
                                    }}
                                    InputLeftElement={
                                        <Icon
                                            m="2"
                                            ml="3"
                                            size="6"
                                            color="gray.400"
                                            as={<MaterialIcons name="search" />}
                                        />
                                    }
                                />
                            </VStack>
                        </VStack>
                        <Pressable
                            onPress={() => {
                                setShowModal(true);
                            }}
                        >
                            {({ isHovered, isFocused, isPressed }) => {
                                return (
                                    <Badge
                                        colorScheme="success"
                                        alignSelf="flex-end"
                                        variant={
                                            isPressed ? "solid" : "outline"
                                        }
                                        px="3"
                                        py="1"
                                        mr={3}
                                        rounded={8}
                                        _text={{
                                            fontSize: 15,
                                        }}
                                        style={{
                                            transform: [
                                                {
                                                    scale: isPressed ? 0.96 : 1,
                                                },
                                            ],
                                        }}
                                    >
                                        Filtrar
                                        {/* <Icon
                                            // m="2"
                                            // ml="3"
                                            // size="6"
                                            color="success.600"
                                            as={<MaterialIcons name="filter-list" />}
                                        /> */}
                                    </Badge>
                                );
                            }}
                        </Pressable>

                        {modalFilter}
                        <Divider my="2" />
                        {/* <Heading fontSize="2xl" alignSelf="center">Revisiones</Heading> */}

                        <VStack space={2} mt={5}>
                            {sizeOfExtintors === allRevisions.length && sizeOfExtintors > 0 ? (
                                filterRevisions.length > 0 ? (
                                    filterRevisions.map((revision) =>
                                        renderRevision(revision)
                                    )
                                ) : (
                                    <View >
                                        {search !== "" ? (
                                            <Text alignSelf="center">
                                                No se encontró información
                                            </Text>
                                        ) : (
                                            <Text alignSelf="center">
                                                Busca el extintor por código o por colaborador.
                                            </Text>
                                        )}
                                    </View>
                                )
                            ) : (
                                <VStack alignSelf="center" space={3}>
                                    <Text>Cargando información...</Text>
                                    <Spinner size="lg" color="primary.900" />
                                </VStack>
                            )}
                        </VStack>
                    </ScrollView>
                </Box>
            </View>
        </NativeBaseProvider>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    topModal: {
        marginBottom: "auto",
        marginTop: 100,
    },
});
export default ListRevisions;
